import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { AUTH_SERVICE } from '../constants/services';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, map, of, tap } from 'rxjs';
import { UserDto } from '../dto';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(@Inject(AUTH_SERVICE) private readonly authClient: ClientProxy) {}
  canActivate(context: ExecutionContext) {
    const jwt = context.switchToHttp().getRequest().cookies?.Authetication;
    console.log('libcookie, ', jwt);
    if (!jwt) {
      return false;
    }
    return this.authClient.send('authendicate', { Authetication: jwt }).pipe(
      tap((res) => {
        context.switchToHttp().getRequest().user = res;
      }),
      map(() => true),
      catchError(() => of(false)),
    );
  }
}
