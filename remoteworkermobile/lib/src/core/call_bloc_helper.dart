import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:remoteworkermobile/main.dart';
import 'package:remoteworkermobile/src/presentation/bloc/auth_bloc/auth_bloc.dart';
import 'package:remoteworkermobile/src/presentation/bloc/timeinout_bloc/bloc/timeinout_bloc.dart';

final authBloc =
    BlocProvider.of<AuthBloc>(MainApp.navigatorKey.currentContext!);

final timeinoutBloc =
    BlocProvider.of<TimeinoutBloc>(MainApp.navigatorKey.currentContext!);
