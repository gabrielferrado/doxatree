import mongoose from 'mongoose';

mongoose.connect(
  process.env.DB_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.Promise = global.Promise;

export default mongoose;
