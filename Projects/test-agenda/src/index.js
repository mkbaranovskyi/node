import { Agenda } from 'agenda/es';

// const connectionString = 'mongodb://127.0.0.1/agenda';
const connectionString = 'mongodb+srv://Max:qwer1234@maxcluster.yvvzb.mongodb.net/agenda?retryWrites=true&w=majority';

const agenda = new Agenda({
  db: { address: connectionString, collection: 'jobs' },
  processEvery: '2 seconds'
});

// Prepare
agenda.define('say hi', { priority: 'high', concurrency: 10 }, (job, done) => {
  console.log('hi');
  done()
  // const { to } = job.attrs.data;
  // emailClient.send({
  //   to,
  //   from: 'example@example.com',
  //   subject: 'Email Report',
  //   body: '...'
  // }, done);
});


// Run once
(async function () {
  // await new Promise(resolve => setTimeout(resolve, 2000))
  await agenda.start();
  await agenda.now('say hi')
  // await agenda.every('2 seconds', 'say hi')
  const sayHi = agenda.create('say hi');
  // // await agenda.schedule('in 1 seconds', 'say hi', { to: 'admin@example.com' });
  // await sayHi.repeatEvery('2 seconds').save();
})();

// Periodic jobs
// (async function() {
//   const weeklyReport = agenda.create('send email report', {to: 'example@example.com'});
//   await agenda.start();
//   await weeklyReport.repeatEvery('1 week').save();
// })();