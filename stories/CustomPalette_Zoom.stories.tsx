import React from 'react';
import { Gantt } from '../src';
import { CustomPalette_Zoom } from './CustomPalette_Zoom';

export default {
  title: 'CustomPalette_Zoom',
  component: Gantt,
};

const Template = (props: any) => <CustomPalette_Zoom {...props} />;

export const CustomPaletteZoomStory = {
  name: 'CustomPalette_Zoom',
  render: (args: any) => <Template {...args} />,
};
