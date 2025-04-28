import React, { useCallback, useState } from "react";

import {
  BarMoveAction,
  DateExtremity,
  Gantt,
  GanttDateRoundingTimeUnit,
  OnChangeTasks,
  Task,
  TaskContextualPaletteProps,
  TaskDependencyContextualPaletteProps,
  TaskOrEmpty,
  ViewMode,
} from "../src";

import { initTasks, onAddTask, onEditTask } from "./helper";

import "../dist/gantt-task-react.css";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import styles from "./CustomPalette_Zoom.module.css";

export const CustomPalette_Zoom: React.FC = props => {
  const [tasks, setTasks] = useState<readonly TaskOrEmpty[]>(initTasks());
  const [viewMode, setView] = React.useState<ViewMode>(ViewMode.Day);

  const onChangeTasks = useCallback<OnChangeTasks>(
    (newTaskOrEmptys, action) => {
      const newTasks: Task[] = newTaskOrEmptys.map(task => task as Task);
      switch (action.type) {
        case "delete_relation":
          if (
            window.confirm(
              `Do yo want to remove relation between ${action.payload.taskFrom.name} and ${action.payload.taskTo.name}?`
            )
          ) {
            setTasks(newTasks);
          }
          break;

        case "delete_task":
          if (window.confirm("Are you sure?")) {
            setTasks(newTasks);
          }
          break;

        default:
          const taskWithChildrenIds = newTasks.map((task: Task) => task.parent);
          newTasks.map((task: Task) => {
            if (taskWithChildrenIds.includes(task.id)) {
              task.type = "project";
            } else if (task.start && task.start === task.end) {
              task.type = "milestone";
            }
          });
          setTasks(newTasks);
          break;
      }
    },
    []
  );

  const handleDblClick = useCallback((task: Task) => {
    alert("On Double Click event Id:" + task.id);
  }, []);

  const handleClick = useCallback((task: TaskOrEmpty) => {
    console.log("On Click event Id:" + task.id);
  }, []);

  const handleTaskDelete = (task: Task) => {
    const conf = window.confirm("Are you sure about " + task.name + " ?");
    if (conf) {
      setTasks(tasks.filter(t => t.id !== task.id));
    }
    return conf;
  };

  const handleTaskCreate = (task: Task) => {
    const newTask: TaskOrEmpty = {
      id: Math.random().toString(36).slice(-6),
      name: task.name + "x",
      parent: task.parent,
      start: new Date(
        task.start.getFullYear(),
        task.start.getMonth(),
        task.start.getDate()
      ),
      end: new Date(
        task.end.getFullYear(),
        task.end.getMonth(),
        task.end.getDate()
      ),
      progress: 25,
      type: "project",
      hideChildren: false,
    };
    setTasks([...tasks, newTask]);
  };

  const handleWheel = (wheelEvent: WheelEvent) => {
    if (wheelEvent.ctrlKey) {
      wheelEvent.preventDefault();
      const deltaY = wheelEvent.deltaY;

      if (deltaY < 0 && viewMode !== ViewMode.Hour) {
        const currentIndex = Object.values(ViewMode).indexOf(viewMode);
        const newZoomLevel = Object.values(ViewMode)[currentIndex - 1];
        if (newZoomLevel) {
          setView(newZoomLevel);
        }
      } else if (deltaY > 0 && viewMode !== ViewMode.Month) {
        const currentIndex = Object.values(ViewMode).indexOf(viewMode);
        const newZoomLevel = Object.values(ViewMode)[currentIndex + 1];
        if (newZoomLevel) {
          setView(newZoomLevel);
        }
      }
    }
  };

  const ContextualPalette: React.FC<TaskContextualPaletteProps> = ({
    selectedTask,
    onClosePalette: onClose,
  }) => {
    return (
      <div className={styles.buttonEntries}>
        <IconButton
          size="small"
          aria-label="Delete task"
          title="Delete task"
          onClick={() => handleTaskDelete(selectedTask)}
          data-testid="delete-task"
        >
          <DeleteForeverIcon fontSize="small" />
        </IconButton>
        <IconButton
          size="small"
          aria-label="Create task"
          title="Create task"
          onClick={() => handleTaskCreate(selectedTask)}
          data-testid="create-task"
        >
          <AddIcon fontSize="small" />
        </IconButton>
        <IconButton
          size="small"
          aria-label="Close toolbar"
          title="Close toolbar"
          onClick={onClose}
          data-testid="close-toolbar"
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </div>
    );
  };

  const handleTaskDependencyDelete = (
    taskFrom: Task,
    extremityFrom: DateExtremity,
    taskTo: Task,
    extremityTo: DateExtremity,
    onClose: () => any
  ) => {
    const newTasks = tasks.map(t => {
      if (t => t.id == taskTo.id) {
        const dependenciesToKeep = taskTo.dependencies?.filter(dependency => {
          const isDependencyToRemove =
            dependency.sourceId === taskFrom.id &&
            dependency.sourceTarget === extremityFrom &&
            dependency.ownTarget === extremityTo;
          return !isDependencyToRemove;
        });
        return {
          ...t,
          dependencies: dependenciesToKeep,
        };
      } else return t;
    });
    onClose();
    setTasks(newTasks);
  };

  const DependencyContextualPalette: React.FC<
    TaskDependencyContextualPaletteProps
  > = ({
    taskFrom,
    extremityFrom,
    taskTo,
    extremityTo,
    onClosePalette: onClose,
  }) => {
    return (
      <div className={styles.buttonEntries}>
        <IconButton
          size="small"
          aria-label="Delete task"
          title="Delete task"
          onClick={() =>
            handleTaskDependencyDelete(
              taskFrom,
              extremityFrom,
              taskTo,
              extremityTo,
              onClose
            )
          }
          data-testid="delete-task"
        >
          <DeleteForeverIcon fontSize="small" />
        </IconButton>
        <IconButton
          size="small"
          aria-label="Close toolbar"
          title="Close toolbar"
          onClick={onClose}
          data-testid="close-toolbar"
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </div>
    );
  };

  const onChangeExpandState = (changedTask: Task) => {
    setTasks(prev => {
      return prev.map(task => {
        if (changedTask.id === task.id) {
          return { ...changedTask };
        }
        return task;
      });
    });
  };

  const roundDate = (
    date: Date,
    _: ViewMode,
    dateExtremity: DateExtremity,
    action: BarMoveAction
  ): Date => {
    if (dateExtremity == "startOfTask") {
      return roundStartDate(date, action);
    } else {
      return roundEndDate(date, action);
    }
  };

  const dateMoveStep = { value: 1, timeUnit: GanttDateRoundingTimeUnit.DAY };

  const getDayOfTheYear = (date: Date) => {
    const start = new Date(date.getFullYear(), 0, 0);
    // const diff = date.getTime() - start.getTime();
    const diff =
      date.getTime() -
      start.getTime() +
      (start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000;
    const oneDay = 1000 * 60 * 60 * 24;
    const day = Math.floor(diff / oneDay);
    return day;
  };

  /*
  The rounding for start Date is always done with floor value
  */
  const roundStartDate = (date: Date, _: BarMoveAction): Date => {
    let value = dateMoveStep.value;
    const dimension = dateMoveStep.timeUnit;
    const newdate = new Date(date);

    // When moving the task, the rounding is done when the nearest value
    // This allow to keep the task duration which is the priority
    if (dimension == GanttDateRoundingTimeUnit.DAY) {
      let dayOfTheYear: number = getDayOfTheYear(newdate);
      if (
        newdate.getMinutes() != 0 ||
        newdate.getHours() != 0 ||
        (dayOfTheYear - 1) % value > 0
      ) {
        newdate.setHours(0);
        newdate.setMinutes(0);
        dayOfTheYear = Math.floor((dayOfTheYear - 1) / value) * value + 1; //OK
        newdate.setMonth(0);
        newdate.setDate(1);
        newdate.setDate(dayOfTheYear);
      }
    } else if (dimension == GanttDateRoundingTimeUnit.HOUR) {
      newdate.setMinutes(0);
      let hour = Math.floor(newdate.getHours() / value) * value;
      newdate.setHours(hour);
    } else if (dimension == GanttDateRoundingTimeUnit.MINUTE) {
      let minute = Math.floor(newdate.getMinutes() / value) * value;
      newdate.setMinutes(minute);
    }
    newdate.setSeconds(0);
    newdate.setMilliseconds(0);
    return newdate;
  };

  /*
  The rounding for end Date is always done with ceil value
  */
  const roundEndDate = (date: Date, action: BarMoveAction): Date => {
    let value = dateMoveStep.value;
    const dimension = dateMoveStep.timeUnit;
    const newdate = new Date(date);
    if (dimension == GanttDateRoundingTimeUnit.DAY) {
      let dayOfTheYear: number = getDayOfTheYear(newdate);
      if (
        newdate.getMinutes() != 0 ||
        newdate.getHours() != 0 ||
        (dayOfTheYear - 1) % value > 0
      ) {
        newdate.setMinutes(0);
        newdate.setHours(0);
        if (action == "move") {
          // In case of move we need to round start and end date with the same direction (floor) so that the duration keeps unchanged
          dayOfTheYear = Math.floor((dayOfTheYear - 1) / value) * value + 1; // OK
        } else {
          dayOfTheYear = Math.ceil(dayOfTheYear / value) * value + 1; // OK
        }
        newdate.setMonth(0);
        newdate.setDate(1);
        newdate.setDate(dayOfTheYear);
      }
    } else if (dimension == GanttDateRoundingTimeUnit.HOUR) {
      if (newdate.getMinutes() != 0 || newdate.getHours() % value > 0) {
        newdate.setMinutes(0);
        let hours = newdate.getHours();
        if (action == "move") {
          // In case of move we need to round start and end date with the same direction (floor) so that the duration keeps unchanged
          hours = Math.floor(newdate.getHours() / value) * value;
        } else {
          hours = Math.ceil(newdate.getHours() / value) * value;
        }
        newdate.setHours(hours);
      }
    } else if (dimension == GanttDateRoundingTimeUnit.MINUTE) {
      if (newdate.getMinutes() % value > 0) {
        let minutes = newdate.getMinutes();
        if (action == "move") {
          // In case of move we need to round start and end date with the same direction (floor) so that the duration keeps unchanged
          minutes = Math.floor(newdate.getMinutes() / value) * value;
        } else {
          minutes = Math.ceil(newdate.getMinutes() / value) * value;
        }
        newdate.setMinutes(minutes);
      }
    }
    newdate.setSeconds(0);
    newdate.setMilliseconds(0);
    return newdate;
  };

  const checkIsHoliday = (date: Date, _, __, dateExtremity: DateExtremity) => {
    const day = date.getDay();

    let isHoliday = false;
    const isMondayStart =
      date.getDay() === 1 && date.getHours() === 0 && date.getMinutes() === 0;
    const isStaturdayStart =
      date.getDay() === 6 && date.getHours() === 0 && date.getMinutes() === 0;
    if (dateExtremity === "startOfTask") {
      //Monday 00:00 is excluded from WE
      isHoliday = day === 6 || (day === 0 && !isMondayStart);
    } else if (dateExtremity === "endOfTask") {
      //Saturday 00:00 is included from WE
      isHoliday = (day === 6 && !isStaturdayStart) || day === 0 || isMondayStart;
    }

    return isHoliday;
  };

  return (
    <Gantt
      {...props}
      onAddTask={onAddTask}
      onChangeTasks={onChangeTasks}
      onDoubleClick={handleDblClick}
      onEditTask={onEditTask}
      onClick={handleClick}
      tasks={tasks}
      viewMode={viewMode}
      roundDate={roundDate}
      ContextualPalette={ContextualPalette}
      TaskDependencyContextualPalette={DependencyContextualPalette}
      onWheel={handleWheel}
      onChangeExpandState={onChangeExpandState}
      checkIsHoliday={checkIsHoliday}
      dateMoveStep={dateMoveStep}
    />
  );
};
