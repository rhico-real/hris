part of 'auth_bloc.dart';

abstract class AuthEvent extends Equatable {
  const AuthEvent();

  @override
  List<Object> get props => [];
}

class GetStoredAuthEvent extends AuthEvent {
  const GetStoredAuthEvent();
}

class LoginEvent extends AuthEvent {
  final String username;
  final String password;
  const LoginEvent(this.username, this.password);
}
