const express = require('express');
const keys = require('./config/keys');
const User = require('./model/user');
const Post = require('./model/post');
const Solution = require('./model/solution');
const app = express();

const port = process.env.PORT;
// const port = 5000;

require('./authExpress')(app);
app.use( express.static( "public" ) );

app.get('/api/current_user',(req,res)=>{
    res.render('homePage',{user: req.user});
});

app.get('/logged/profile',(req,res)=>{
    res.render('profile',{user: req.user});
    console.log(req.user.name);
});

app.get('/askQuestion',(req,res)=>{
    res.render('askQues',{user: req.user});
});

app.post('/newQuestion/:id',(req,res)=>{
    console.log(req.body.title);
    console.log(req.body.question);
    var newPost = new Post({
        title: req.body.title,
        question: req.body.question
    });
    User.findById(req.params.id)
    .then((user)=>{
        user.posts.push(newPost);
        user.save();
        newPost.save();
    });
    res.redirect('/api/current_user');

});

app.get('/giveSolution',(req,res)=>{
    res.render('solutionSearch',{user:req.user});
});

app.post('/getQuestions/:id',(req,res)=>{
    console.log(req.body.title);
    Post.find({title:req.body.title})
    .then((results)=>{
        
        // console.log(results);
        res.render('searchResults',{results:results});
        
        
    });
});

app.get('/provideSolution/:id',(req,res)=>{
    Post.findById(req.params.id)
    .then((post)=>{
        // console.log(post);
        res.render('solutionProvide',{post:post});
        
    })
});

app.post('/addSolution/:id',(req,res)=>{
    var newSolution = new Solution({
        solution:req.body.solutionText,
        user:req.user
    });
    Post.findById(req.params.id)
    .then((post)=>{
        post.solutions.push(newSolution);
        post.save();
        newSolution.save();
        console.log(post);
        
    });
    res.redirect('/api/current_user');
});

app.get('/manageQuestions/:id',(req,res)=>{
    User.findById(req.params.id)
    .populate('posts')
    .then((results)=>{
        console.log(results.posts);
        res.render('manageQuestions',{results:results.posts})
    })
});

app.get('/edit/:id',(req,res)=>{
    Post.findById(req.params.id)
    .then((result)=>{
        console.log(result);
        res.render('editPage',{result:result})
    })
});

app.post('/delete/:id',(req,res)=>{
    Post.findByIdAndRemove(req.params.id)
    .then((result)=>{
        res.redirect('/logged/profile')
    })
})

app.post('/edit/question/:id',(req,res)=>{
    Post.findByIdAndUpdate(req.params.id,{$set:{
        
            'title':req.body.title,
            'question':req.body.question
        
    }})
    .then((post)=>{
        console.log(post);
    });
    res.redirect('/logged/profile');

});

app.get('/viewSolutions/:id',(req,res)=>{
    User.findById(req.params.id)
    .populate({
        path:'posts',
        populate:{
            path:'solutions',
            model:'Solution',
            populate:{
                path:'user',
                model:'User'
            }
        }
    })
    .then((results)=>{
        console.log(results);
        results.posts.forEach((post) => {
            console.log(post.title);
            console.log(post.question);
            post.solutions.forEach((solution) => {
                console.log(solution.solution);
            });
        });
        res.render('userSolution.ejs',{results:results});
    })
    

});

app.get('/api/logout',(req,res)=>{
    req.logout();
    res.redirect('/');
});
app.listen(port,(req,res)=>{
    console.log(`Risolto running on ${port}`);
}); 
