import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as AppActions from '../../../actions/settings';

const idGen = ((startId: number) => {
  let id = startId;
  return () => {
    id += 1;
    return id;
  };
})(0);

export default ComposedComponent =>
  connect(
    state => ({
      activeElement: state.app.activeElement,
      activeElementPriority: state.app.activeElementPriority
    }),
    dispatch => bindActionCreators(AppActions, dispatch)
  )(
    class extends Component {
      componentDidMount() {
        const { setActiveElement, activeElement, submit } = this.props;
        if (!submit) {
          return;
        }
        this.id = idGen();
        if (
          !activeElement ||
          (activeElement.id !== this.id &&
            this.submitPriority >= 0 &&
            activeElement.submitPriority < this.submitPriority)
        ) {
          setActiveElement(this);
        }
      }

      componentDidUpdate() {
        const { setActiveElement, activeElement, submit } = this.props;
        if (!submit) {
          return;
        }
        if (
          !activeElement ||
          (activeElement.id !== this.id &&
            this.submitPriority >= 0 &&
            activeElement.submitPriority < this.submitPriority)
        ) {
          setActiveElement(this);
        }
      }

      componentWillUnmount() {
        const { freeActiveElement, activeElement, submit } = this.props;
        if (!submit) {
          return;
        }
        if (activeElement && activeElement.id === this.id) {
          freeActiveElement();
        }
      }

      get submitPriority(): number {
        const childElement = this.componentRef.current;
        return childElement ? childElement.submitPriority : 0;
      }

      submit() {
        if (this.componentRef.current) {
          this.componentRef.current.submit();
        }
      }

      componentRef = React.createRef();

      render() {
        return <ComposedComponent {...this.props} ref={this.componentRef} />;
      }
    }
  );
