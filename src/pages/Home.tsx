import "@codetrix-studio/capacitor-google-auth";
import './Login.css';

import { IonButton, IonCol, IonContent, IonHeader, IonItem, IonLabel, IonList, IonPage, IonRow, IonText, IonThumbnail, IonTitle, IonToolbar } from '@ionic/react';
import React, { Component } from 'react';

import { Plugins } from '@capacitor/core';
import { UserService } from '../services/UserSerivce';

const INITIAL_STATE = {
  loggedIn: true,
  user: {}
};

class Home extends Component {
  state: any = {};
  props: any = {};
  constructor(props: any) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  componentDidMount() {
    this.getUserInfo();
  }

  async signOut(): Promise<void> {
    const { history } = this.props;
    await Plugins.GoogleAuth.signOut();
    UserService.logout();

    history.goBack();
  }

  async getUserInfo() {
    this.setState({
      user: {
        name: this.props.location.state.name,
        image: this.props.location.state.image,
        email: this.props.location.state.email
      }
    })
  }

  render() {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar color="primary">
            <IonTitle>Logged in ... </IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">

          <IonRow>
            <IonCol className="text-center">
              <IonText className="title">
                You are logged in {UserService.getCurrentPlayer().name}!
              </IonText>
            </IonCol>
          </IonRow>

          {this.state.user.name &&
            <IonItem>
              <IonThumbnail slot="start">
                <img src={this.state.user.image} />
              </IonThumbnail>
              <IonLabel>
                <h3>{this.state.user.name}</h3>
                <p>{this.state.user.email}</p>
              </IonLabel>
            </IonItem>
          }

          <IonButton className="login-button" onClick={() => this.signOut()} expand="full" fill="solid" color="danger">
            Logout from Google
        </IonButton>
          <IonList>
            <IonButton onClick={(e) => { e.preventDefault(); this.props.history.push({ pathname: "/game", state: "t" }) }}>
              GO TO CREATE
          </IonButton>
            <IonButton onClick={(e) => { e.preventDefault(); this.props.history.push({ pathname: "/test", state: "t " }) }}>
              GO TO Test
          </IonButton>
            <IonButton onClick={(e) => { e.preventDefault(); this.props.history.push({ pathname: "/chat", state: "t " }) }}>
              GO TO chat
          </IonButton>
            <IonButton onClick={(e) => { e.preventDefault(); this.props.history.push({ pathname: "/myGames", state: "t " }) }}>
              GO TO my games
          </IonButton>
            <IonButton onClick={(e) => { e.preventDefault(); this.props.history.push({ pathname: "/lobby", state: "t " }) }}>
              GO TO Lobby
          </IonButton>
            <IonButton onClick={(e) => { e.preventDefault(); this.props.history.push({ pathname: "/lobbysearch", state: "t " }) }}>
              GO TO Lobby search
          </IonButton>
            <IonButton onClick={(e) => { e.preventDefault(); this.props.history.push({ pathname: "/Tab1", state: "t " }) }}>
              QR
            </IonButton>

          </IonList>
        </IonContent>
      </IonPage>
    )
  }
}

export default Home;
