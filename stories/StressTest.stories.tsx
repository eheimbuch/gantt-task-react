import React from "react";
import { Gantt } from "../src";
import { StressTest } from "./StressTest";

export default {
  title: "StressTest",
  component: Gantt,
  argTypes: {
    numberOfRoots: { control: "number" },
    numberOfSubtasks: { control: "number" },
    depth: { control: "number" },
  },
  args: {
    numberOfRoots: 4,
    numberOfSubtasks: 4,
    depth: 4,
  },
};

const Template = (props: any) => <StressTest {...props} />;

export const StressTestStory = {
  name: "StressTest",
  render: (args: any) => <Template {...args} />,
};
