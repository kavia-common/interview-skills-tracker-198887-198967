#!/bin/bash
cd /home/kavia/workspace/code-generation/interview-skills-tracker-198887-198967/interview_prep_tracker_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

