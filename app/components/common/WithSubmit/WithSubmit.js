import React, { Component } from 'react';

export default ComposedComponent =>
  class extends Component {
    componentDidMount() {
      document.body.addEventListener('keydown', this.onKeyPressed);
    }

    componentWillUnmount() {
      document.body.removeEventListener('keydown', this.onKeyPressed);
    }

    onKeyPressed = (e: KeyboardEvent) => {
      if (document.activeElement.tagName === 'TEXTAREA') {
        return;
      }
      if (e.code === 'Enter' || e.code === 'NumpadEnter') {
        e.preventDefault();
        const { current } = this.componentRef;
        if (current.onSubmit) {
          current.onSubmit();
        }
      }
      if (e.code === 'Escape') {
        e.preventDefault();
        const { current } = this.componentRef;
        if (current.onEscape) {
          current.onEscape();
        }
      }
    };

    componentRef = React.createRef();

    render() {
      return (
        <ComposedComponent
          {...this.props}
          {...this.state}
          ref={this.componentRef}
        />
      );
    }
  };
