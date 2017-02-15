const assert = require('assert');
const User = require('../src/user');

describe('Subdocuments', () => {
    it('can create a subdocument', (done) => {
        const joe = new User({
            name: 'Joe',
            posts: [{ title: 'Happy to be alive' }],
        });

        joe.save()
            .then(() => User.findOne({ name: 'Joe' }))
            .then((user) => {
                assert(user.posts && user.posts.length > 0 && user.posts[0].title === 'Happy to be alive');
                done();
            });
    });

    it('can add subdocuments to an existing record', (done) => {
        const joe = new User({
            name: 'Joe',
            posts: [],
        });

        joe.save()
            .then(() => User.findOne({ name: 'Joe' }))
            .then((user) => {
                user.posts.push({ title: 'Happy to be alive' });
                return user.save();
            })
            .then(() => User.findOne({ name: 'Joe' }))
            .then((user) => {
                assert(user.posts && user.posts.length > 0 && user.posts[0].title === 'Happy to be alive');
                done();
            });
    });

    it('can remove an existing subdocument', (done) => {
        const joe = new User({
            name: 'Joe',
            posts: [{ title: 'Happy to be alive' }],
        });

        joe.save()
            .then(() => User.findOne({ name: 'Joe' }))
            .then(user => {
                const post = user.posts[0];
                post.remove();
                return user.save();
            })
            .then(() => User.findOne({ name: 'Joe' }))
            .then(user => {
                assert(!user.posts || user.posts.length === 0);
                done();
            });
    });
});