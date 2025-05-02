import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard'
import { UseGuards } from '@nestjs/common'

export const Auth = () => UseGuards(JwtAuthGuard)
