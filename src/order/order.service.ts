/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpException, HttpStatus, Injectable, Request } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role } from 'src/auth/enums/role.enum';
import { CartService } from 'src/cart/cart.service';
import { OrderDto } from 'src/dto/create-order-dto';
import { Order, OrderDocument } from 'src/schemas/order.schema';
import { UserService } from 'src/user/user.service';
import { ApiFeatures } from 'src/utils/api-feature';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel('Order') private readonly orderModel: Model<OrderDocument>,
    private readonly userService: UserService,
    private readonly cartService: CartService,
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async fakeStripeAPI(amount, currency) {
    const client_secret = 'someRandomValue';
    return { client_secret, amount };
  }

  async createOrder(orderDto: OrderDto, @Request() req) {
    const userId = req.user.id;
    const validUser = await this.userService.findById(userId);
    //console.log(validUser)
    if (!validUser)
      throw new HttpException(
        'User with the given ID not found',
        HttpStatus.NOT_FOUND,
      );
    const { items: cartItems, delivery_fee } = req.body;
    if (!cartItems || cartItems.length < 1)
      throw new HttpException(
        'Please provide cart items',
        HttpStatus.BAD_REQUEST,
      );
    if (!delivery_fee)
      throw new HttpException(
        'Please provide delivery fee',
        HttpStatus.BAD_REQUEST,
      );
    let orderItems = [];
    let subTotal = 0;
    for (const item of cartItems) {
      const validCart = await this.cartService.findById(item.cart, req);
      if (!validCart)
        throw new HttpException(
          `Cart with the given ID: ${item.cart} not found`,
          HttpStatus.NOT_FOUND,
        );
      //checkPermissions(req.user, dbCart.user)
      const { price, quantity } = validCart;
      const singleOrderItem = {
        quantity: validCart.quantity,
        price: validCart.price,
        cart: item.cart,
      };
      console.log(singleOrderItem);

      orderItems = [...orderItems, singleOrderItem];
      subTotal += price;
    }

    const order = new this.orderModel(orderDto);
    order.total = delivery_fee + subTotal;
    order.sub_total = subTotal;
    order.orderItems = orderItems;
    order.user = userId;

    const payment_intent = await this.fakeStripeAPI(order.total, 'usd');

    order.client_secret = payment_intent.client_secret;

    await order.save();

    return { order, client_secret: order.client_secret };
  }

  async getAll(queryStry: any, @Request() req): Promise<any> {
    const totalOrderCount = await this.orderModel.countDocuments();
    const resultPerPage = parseInt(req.query.limit) || totalOrderCount;
    const page = parseInt(req.query.page) || 1;

    const query = this.orderModel
      .find({})
      .populate({ path: 'user', select: 'username email' });

    const apiFeatures = new ApiFeatures<OrderDocument>(query, queryStry);

    apiFeatures.search().filter().pagination(resultPerPage);

    const orders = await apiFeatures.executeQuery();

    const filteredOrderCount = orders.length;

    if (orders.length === 0) {
      throw new HttpException('No Orders found', HttpStatus.NOT_FOUND);
    }

    return {
      data: orders,
      totalOrderCount,
      filteredOrderCount,
      page,
      resultPerPage,
    };
  }

  async findById(id: string, @Request() req): Promise<Order | undefined> {
    const order = await this.orderModel
      .findOne({ _id: id })
      .populate({ path: 'user', select: 'username email' })
      .exec();

    if (!order)
      throw new HttpException(
        'Order with the given ID not found',
        HttpStatus.NOT_FOUND,
      );
    console.log(req.user.email, req.user.roles, order.user.email);

    const hasAdminRole = req.user.roles.includes(Role.Admin);

    if (order.user.email !== req.user.email && !hasAdminRole)
      throw new HttpException(
        'You do not have permission to access this order',
        HttpStatus.UNAUTHORIZED,
      );
    return order;
  }

  async currentUser(@Request() req): Promise<Order[] | undefined> {
    const order = await this.orderModel
      .find({ user: req.user.id })
      .populate({ path: 'user', select: 'username email' })
      .exec();
    if (!order || order.length === 0)
      throw new HttpException(
        `No Order has been placed by this current user: ${req.user.username}`,
        HttpStatus.NOT_FOUND,
      );
    return order;
  }

  async approveOrder(id: string, @Request() req): Promise<Order | undefined> {
    const { status, payment_intentId } = req.body;
    if (!status)
      throw new HttpException(
        'Please provide the updated status of the order',
        HttpStatus.BAD_REQUEST,
      );
    const order = await this.orderModel
      .findOne({ _id: id })
      .populate({ path: 'user', select: 'username email' })
      .exec();
    if (!order)
      throw new HttpException(
        'The Order selected for approval does not exist',
        HttpStatus.NOT_FOUND,
      );
    const approverId = req.user.id;
    const validApprover = await this.userService.findById(approverId);
    //console.log(validUser)
    if (!validApprover)
      throw new HttpException(
        'Approver with the given ID not found',
        HttpStatus.NOT_FOUND,
      );

    order.approver = req.user.id;
    order.payment_intentId = req.body.payment_intentId;
    order.status = req.body.status;

    await order.save();

    return order;
  }

  async delete(id: string, @Request() req): Promise<any> {
    const order = await this.orderModel
      .findOne({ _id: id })
      .populate({ path: 'user', select: 'username email' });
    console.log(order);
    if (!order)
      throw new HttpException(
        'Order with the given ID not found',
        HttpStatus.NOT_FOUND,
      );
    console.log(req.user.email, order.user.email);

    if (order.user.email !== req.user.email)
      throw new HttpException(
        'You do not have permission to delete this order',
        HttpStatus.UNAUTHORIZED,
      );
    const deletedOrder = await this.orderModel.findByIdAndDelete(id);
    return { msg: 'Order Item successfully deleted' };
  }
}
