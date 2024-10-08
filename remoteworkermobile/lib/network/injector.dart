import 'package:dio/dio.dart';
import 'package:get_it/get_it.dart';
import 'package:remoteworkermobile/src/presentation/bloc/auth_bloc/auth_bloc.dart';
import 'package:remoteworkermobile/src/presentation/bloc/timeinout_bloc/bloc/timeinout_bloc.dart';

final injector = GetIt.instance;

class Injector {
  Future<void> initializeDependencies() async {
    //Dio client
    injector.registerSingleton<Dio>(Dio());

    //Bloc
    injector.registerFactory<AuthBloc>(() => AuthBloc());
    injector.registerFactory<TimeinoutBloc>(() => TimeinoutBloc());
  }
}
