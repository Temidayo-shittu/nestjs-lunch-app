export const createTokenUser= (user)=>{
    return {
        username: user.username,
        userId: user._id,
        email: user.email,
        mobile: user.mobile,
        location: user.location,
        roles: user.roles,
    }  
}

