import Nightmare from 'nightmare';
import pandoc from 'node-pandoc'

const URL_BLOG = 'https://onceamarinebook.wordpress.com/';
const args = '-f html -t docx -o OnceAMarineManuscript(edited).docx';

const nightmare = new Nightmare({ show: true }).viewport(1041, 800);

(async() => {
  await nightmare
    .goto(URL_BLOG)
    .evaluate(function() {
        window.document.body.scrollTop = document.body.scrollHeight;
    })
    .wait(2000)
    .evaluate(function() {
        window.document.body.scrollTop = document.body.scrollHeight;
    })
    .wait(2000)
    .evaluate(
      () => {
        let posts = [];
        document.querySelectorAll('article.post').forEach(
          post => {
            posts = posts.concat({
              title: post.querySelector('header h1').textContent.trim(),
              text: post.querySelector('.entry-content').innerHTML.trim()
            });
          }
        );
        posts = posts.reverse();
        let html = '';
        posts.forEach(
            post => {
              html += '<h1>' + post.title + '</h1>' + post.text;
            });
        return html;
      }
    )
    .end()
    .then(
      result => pandoc(result, args, (err, result) => { if (err) console.error('Oh Nos: ',err); })
    );
})();
