import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

import { AuthService } from '@/auth/auth.service'
import { LoginResponseDto } from '@/auth/dto/login-response.dto'
import { LoginDto } from '@/auth/dto/login.dto'
import { SignupDto } from '@/auth/dto/signup.dto'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: SignupDto })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'User successfully created' })
  async signup(@Body() signupRequest: SignupDto): Promise<void> {
    await this.authService.signup(signupRequest)
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: HttpStatus.OK, type: LoginResponseDto, description: 'Login successful' })
  async login(@Body() loginRequest: LoginDto): Promise<LoginResponseDto> {
    return new LoginResponseDto(await this.authService.login(loginRequest))
  }
}
