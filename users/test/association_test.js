const mongoose = require('mongoose');
const User = require('../src/user');
const BlogPost = require('../src/blogPost');
const Comment = require('../src/comment');
const assert = require('assert');

describe('Associations', () => {
    let joe, blogPost, comment;

    beforeEach(done => {
        joe = new User({ name: 'Joe' });
        blogPost = new BlogPost({ title: 'Life is great', content: 'Lorem ipsum' });
        comment = new Comment({ content: 'Im glad life is great for you' });

        joe.blogPosts.push(blogPost);
        blogPost.comments.push(comment);
        comment.user = joe;

        Promise.all([joe.save(), blogPost.save(), comment.save()]).then(results => {
            done();
        });
    });

    it('saves a relation between a user and a blogpost', done => {
        User.findOne({ name: 'Joe' })
            .populate('blogPosts')
            .then(user => {
                assert(user.blogPosts[0].title === 'Life is great')
                done();
            });
    });

    it('saves a full relation tree', done => {
        User.findOne({ name: 'Joe' })
            .populate({
                path: 'blogPosts',
                populate: {
                    path: 'comments',
                    model: 'comment',
                    populate: {
                        path: 'user',
                        model: 'user'
                    }
                }
            }).then(user => {
                assert(user.name === 'Joe');
                assert(user.blogPosts[0].title === 'Life is great');
                assert(user.blogPosts[0].comments[0].content === 'Im glad life is great for you');
                assert(user.blogPosts[0].comments[0].user.name === 'Joe');
                done();
            })
    });
});
