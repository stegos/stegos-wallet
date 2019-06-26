// @flow
import React, { Component } from 'react';

type Props = {
  setBugsAndTerms: boolean => void
};

export default class BagsAndTerms extends Component<Props> {
  props: Props;

  state = {
    isSentBugs: false
  };

  onNext = () => {
    const { setBugsAndTerms } = this.props;
    const { isSentBugs } = this.state;
    setBugsAndTerms(isSentBugs);
  };

  render() {
    return (
      <button type="button" onClick={this.onNext}>
        Next
      </button>
    );
  }
}
