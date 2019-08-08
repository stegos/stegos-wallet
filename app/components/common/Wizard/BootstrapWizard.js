import React, { PureComponent } from 'react';
import { injectIntl } from 'react-intl';
import Wizard from './Wizard';

type Props = {
  step: number,
  intl: any
};

class BootstrapWizard extends PureComponent<Props> {
  props: Props;

  render() {
    const { intl, step } = this.props;
    return (
      <Wizard
        steps={[
          {
            number: 1,
            label: intl.formatMessage({ id: 'bootstrap.step.one.label' }),
            active: step >= 1
          },
          {
            number: 2,
            label: intl.formatMessage({ id: 'bootstrap.step.two.label' }),
            active: step >= 2
          },
          {
            number: 3,
            label: intl.formatMessage({ id: 'bootstrap.step.three.label' }),
            active: step >= 3
          }
        ]}
      />
    );
  }
}

export default injectIntl(BootstrapWizard);
