import React, { useMemo } from 'react';
import { Gantt, TitleColumn } from '../src';
import { CustomColumns_VerticalScroll } from './CustomColumns_VerticalScroll';
import { initTasks } from './helper';

export default {
  title: 'CustomColumns',
  component: Gantt,
};

const Template = (props: any) => <CustomColumns_VerticalScroll {...props} />;

export const SimpleWithTitle = {
  name: 'Simple with Title',
  render: (args: any) => {
    const tasks = useMemo(() => initTasks(), []);
    const columns = [
      {
        Cell: TitleColumn,
        width: 210,
        title: 'Name',
        id: 'Name',
      },
    ];
    return <Gantt columns={columns} tasks={tasks} {...args} />;
  },
};

export const CustomColumnsVerticalScroll = {
  name: 'CustomColumns_VerticalScroll',
  render: (args: any) => <Template {...args} />,
};
