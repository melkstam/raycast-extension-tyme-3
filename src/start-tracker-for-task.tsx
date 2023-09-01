import { Action, ActionPanel, Icon, List, closeMainWindow, } from "@raycast/api";
import { Task, getTasks, startTrackingTask } from "./getTasks";
import { useCachedPromise, useFrecencySorting } from "@raycast/utils";

function StartTrackerForTask() {
  const { 
    data: tasks,
    isLoading: tasksIsLoading,
   } = useCachedPromise(
    () => getTasks(),
    [],
    {
      keepPreviousData: true,
    }
  )
  const { data: sortedTasks, visitItem: visitTask, resetRanking: resetTaskRanking } = useFrecencySorting(tasks);


  const handleTaskVisit = (task: Task) => {
    closeMainWindow({ clearRootSearch: true });
    visitTask(task);
    startTrackingTask(task.id)
  }

  return (
    <List isLoading={tasksIsLoading}>
      {sortedTasks?.map((task) => (
        <List.Item
          key={task.id}
          title={task.name}
          accessories={[{ text: `${task.category.name} > ${task.project.name}` }]}
          keywords={[task.category.name, task.project.name]}
          actions={
            <ActionPanel>
              <Action title="Start Tracking" icon={Icon.Stopwatch} onAction={() => handleTaskVisit(task)} />
              <Action title="Reset Sorting for Task" icon={Icon.ArrowCounterClockwise} onAction={() => resetTaskRanking(task)} />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}

export default StartTrackerForTask;
