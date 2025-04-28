import React from 'react';
import { Gantt } from '../src';
import { CustomIcons } from './CustomIcons';

export default {
  title: 'CustomIcons',
  component: Gantt,
};

const Template = (props: any) => <CustomIcons {...props} />;

export const CustomIconsStory = {
  name: 'CustomIcons',
  render: (args: any) => <Template {...args} />,
};
