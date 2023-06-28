// @ts-nocheck

import { cloudTasksClient } from "./cloudTasksClient";
import { extractNumbersFromString } from "../../utils/utils";

export async function createHttpTaskWithToken() {
  const project = 'rokni-office';
  const queue = 'queue-del';
  const location = 'europe-west2';
  const url = 'https://europe-west2-rokni-office.cloudfunctions.net/function-1';
  const serviceAccountEmail = '726210090221-compute@developer.gserviceaccount.com';

  const taskDelay = 300 // 300 seconds = 5 minutes

  const payload = {
      message: 'This is a test payload',
      value: 42,
      data: ['ahilleas', 'michi', 'franz'],
  }

  // Construct the fully qualified queue name.
  const parent = cloudTasksClient.queuePath(project, location, queue);

  const task = {
    httpRequest: {
      headers: {
        'Content-Type': 'application/json', // Set content type to ensure compatibility your application's request parsing
      },
      httpMethod: 'POST',
      url,
      oidcToken: {
        serviceAccountEmail,
      },
      body: {},
    },
    scheduleTime: {
      seconds: Math.floor(Date.now() / 1000) + taskDelay, // Set delay of 5 minutes (300 seconds)
    },
  };

  if (payload) {
    task.httpRequest.body = Buffer.from(JSON.stringify(payload)).toString('base64');
  }

  const request = {parent: parent, task: task};

  // Send create task request.
  try {
    const [response] = await cloudTasksClient.createTask(request);
    const id = extractNumbersFromString(response.name);
    return id;
  } catch(error) {
    console.log(error);
    throw new Error(error);
  }
}

export async function deleteCloudTaskById(taskId: string) {
  const project = 'rokni-office';
  const queue = 'queue-del';
  const location = 'europe-west2';

  const taskPath = cloudTasksClient.taskPath(project, location, queue, taskId);
  await cloudTasksClient.deleteTask({ name: taskPath });
  console.log(`Deleted task ${taskPath}`);
}