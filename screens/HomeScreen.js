import React from "react";
import {
  Platform,
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Keyboard,
  TextInput,
  Dimensions
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Stitch, RemoteMongoClient, AnonymousCredential } from "mongodb-stitch-browser-sdk";

var height = Dimensions.get("window").height;

export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: false,
      text: ""
    };
  }
  agregarNuevaTarea = () => {
    Keyboard.dismiss();
    const stitchAppClient = Stitch.defaultAppClient;
    const mongoClient = stitchAppClient.getServiceClient(
      RemoteMongoClient.factory,
      "mongodb-atlas"
    );

    stitchAppClient.auth
      .loginWithCredential(new AnonymousCredential())
      .then((user) => {
        // Retrieve a database object
        const db = mongoClient.db('mitaskmanager')
    
        // Retrieve the collection in the database
        const tasks = db.collection('tasks')
        if (this.state.text != "") {
          tasks.insertOne({
              status: "new",
              description: this.state.text,
              date: new Date(),
              owner_id: user.id
            })
            .then(() => {
              this.setState({ value: !this.state.value });
              this.setState({ text: "" });
            })
            .catch(err => {
              console.warn(err);
            });
        }
      })
      .catch(console.error)

    /*const db = mongoClient.db("mitaskmanager");
    const tasks = db.collection("tasks");
    if (this.state.text != "") {
      tasks
        .insertOne({
          status: "new",
          description: this.state.text,
          date: new Date()
        })
        .then(() => {
          this.setState({ value: !this.state.value });
          this.setState({ text: "" });
        })
        .catch(err => {
          console.warn(err);
        });
    }*/
  };

  static navigationOptions = {
    header: null
  };

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={{
            color: "Black",
            fontSize: 20,
            marginTop: height / 2 - 60
          }}
          placeholder="Agregar tarea..."
          onChangeText={text => this.setState({ text })}
          value={this.state.text}
          onSubmitEditing={() => this.agregarNuevaTarea()}
        />
        <TouchableOpacity onPress={() => this.agregarNuevaTarea()}>
          <Ionicons
            name={Platform.OS == "ios" ? "ios-add-circle" : "md-add-circle"}
            size={50}
            style={{
              marginTop: 50,
              color: "#2e78b7"
            }}
          />
        </TouchableOpacity>
        <ScrollView
          contentContainerStyle={{ flex: 1 }}
          keyboardShouldPersistTaps="handled"
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center"
  }
});
