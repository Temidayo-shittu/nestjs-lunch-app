import { Document, Model, Query } from 'mongoose';

export class ApiFeatures<T extends Document> {
  constructor(private readonly query: Query<T[], T>, private readonly queryStr: any) {}

  search(): this {
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: 'i',
          },
        }
      : {};

    this.query.find({ ...keyword });
    return this;
  }

  filter(): this {
    const queryCopy = { ...this.queryStr };
    const removeFields = ['keyword', 'page', 'limit'];

    removeFields.forEach((key) => delete queryCopy[key]);

    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);

    this.query.find(JSON.parse(queryStr));
    return this;
  }

  pagination(resultPerPage: number): this {
    const currentPage = Number(this.queryStr.page) || 1;
    const skip = resultPerPage * (currentPage - 1);

    if (isNaN(skip) || isNaN(resultPerPage)) {
      throw new Error('Invalid pagination parameters');
    }

    this.query.skip(skip).limit(resultPerPage);
    return this;
  }

  async executeQuery(): Promise<T[]> {
    return await this.query.exec();
  }
}


