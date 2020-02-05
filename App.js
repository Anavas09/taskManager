import React from "react";
import { Platform, StatusBar, StyleSheet, View } from "react-native";
import { AppLoading, Asset, Font, Icon } from "expo";
import AppNavigator from "./navigation/AppNavigator";
import { Stitch, AnonymousCredential, RemoteMongoClient } from "mongodb-stitch-browser-sdk";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: undefined,
      client: undefined,
      cargaFinalizada: false
    };
    this.cargarCliente = this.cargarCliente.bind(this);
  }

  componentDidMount() {
    this.cargarCliente();
  }

  render() {
    if (!this.state.cargaFinalizada && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this.cargarRecursos}
          onError={this.manejarErrores}
          onFinish={this.cargaFinalizada}
        />
      );
    } else {
      return (
        <View style={styles.container}>
          {Platform.OS === "ios" && <StatusBar barStyle="default" />}
          <AppNavigator />
        </View>
      );
    }
  }

  cargarRecursos = async () => {
    return Promise.all([
      Font.loadAsync({
        ...Icon.Ionicons.font,
        "space-mono": require("./assets/fonts/SpaceMono-Regular.ttf")
      })
    ]);
  };

  manejarErrores = error => {
    console.warn(error);
  };

  cargaFinalizada = () => {
    this.setState({ cargaFinalizada: true });
  };

  cargarCliente() {
    const client = Stitch.initializeDefaultAppClient("taskmanager-zgdab")
    
    client.auth.loginWithCredential(new AnonymousCredential())
      .then(user => {
        console.log(`Logeado como ${user.id}`);
        console.log(client)
        this.setState({
          userId: user.id,
          userId: client.auth.user.id,
          client,
        })
      })
      .catch(err => {
        console.log(`Error de login: ${err}`);
        this.setState({ userId: undefined });
      });
    }
  }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  }
});