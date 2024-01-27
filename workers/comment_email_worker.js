const queue = require('../config/kue');
const commentsMails = require('../mailers/comments_mailer');

queue.process('emails', function(job, done){
    console.log("Emails worker is processing a job ",job.data);
    commentsMails.newComment(job.data.email,job.data.name,job.data.comment);
    // commentsMailer.newComment(job)
    done();
  });