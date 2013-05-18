#!/bin/sh
forever -a -l /tmp/app.forever.log -o /tmp/app.out.log -e /tmp/app.err.log start app.js
