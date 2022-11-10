# check start mode is rebuild FE or the deploy dir is empty (did not deploy at all)
if [ "$START_MODE" == "rebuild-fe" ] || [ -z "$(ls -A $VITE_APP_DEPLOY_DIR)" ]
then
  cd $FE_DIR && npm run build
  cp -r $VITE_APP_DEPLOY_DIR/$FE_PUBLISHED_NOTES_DIR /apps/temp/$FE_PUBLISHED_NOTES_DIR
  cp -r $VITE_APP_DEPLOY_DIR/$FE_PUBLISHED_TILS_DIR /apps/temp/$FE_PUBLISHED_TILS_DIR
  rm -rf $VITE_APP_DEPLOY_DIR/*
  cp -r $FE_DIR/dist/* $VITE_APP_DEPLOY_DIR
  cp -r /apps/temp/$FE_PUBLISHED_NOTES_DIR $VITE_APP_DEPLOY_DIR/$FE_PUBLISHED_NOTES_DIR
  cp -r /apps/temp/$FE_PUBLISHED_TILS_DIR $VITE_APP_DEPLOY_DIR/$FE_PUBLISHED_TILS_DIR
fi

cd $BE_DIR && node ./dist/main.js
