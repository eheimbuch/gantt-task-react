import React from 'react';
import { Gantt } from '../src';
import { CustomRelationKind } from './CustomRelationKind';

export default {
  title: 'CustomRelationKind',
  component: Gantt,
};

const Template = (props: any) => <CustomRelationKind {...props} />;

export const CustomRelationKindStory = {
  name: 'CustomRelationKind',
  render: (args: any) => <Template {...args} />,
};
