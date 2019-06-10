import React, { Component } from 'react';
import Welcome from '../components/Welcome';

type Props = {};

export default class WelcomePage extends Component<Props> {
  props: Props;

  render() {
    return <Welcome />;
  }
}
