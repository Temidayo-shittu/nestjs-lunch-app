import { HttpException, HttpStatus } from "@nestjs/common"
import { Roles } from "src/auth/decorators/roles.decorator"


export function checkPermissions(requestUser, resourceUserId) {
    if(requestUser.roles === Roles['admin'] || requestUser._id === resourceUserId) return
     throw new HttpException('Unauthorized access', HttpStatus.UNAUTHORIZED)
  }
  
  