{
    function notification(msg){
        Toastify({
            text: msg,
            duration: 3000,  // Duration in milliseconds
            newWindow: true,
            close: true,
            gravity: "top", // top or bottom
            position: "right", // left, center, or right
            backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
            stopOnFocus: true, // Prevents dismissing the toast on hover/focus
             }).showToast();
    }


    let createPost = function () {
        let newPostForm = $('#new-post-form');
        newPostForm.submit(function (e) {
            e.preventDefault();
            $.ajax({
                url: "/posts/new_post",
                data: newPostForm.serialize(),
                type: "POST",
                dataType : "json",
            }).done(function( json ) {
                console.log(json);
                 let newPost = newPostDom(json.data);
                 $('#feed-display').prepend(newPost);
                 $('#post-content-area').val("");
                 
                 notification("Post is Published");
                 creComment(newPost.find('.post-comments-form'));
                 toggleLikefun(newPost.find('like-toggle-button'));
                 delPost(newPost.find('.delete-post-button'));

                 
              })
              .fail(function( xhr, status, errorThrown ) {
                alert( "Sorry, there was a problem!" );
                console.log( "Error: " + errorThrown );
                console.log( "Status: " + status );
                console.dir( xhr );
              });


        })
        
        // let dele = $('.delete-post-button');
        
        
    }
    let delPost = function(deleteLink){
        $(deleteLink).click(function(e){
            e.preventDefault();
            $.ajax({
                url: $(this).attr('href'),
                type: "GET",
            }).done(function (json) {
                    $(`#post-${json.data.post_id}`).remove();
                    
                    notification("Successfully deleted the post");
                }).fail(function (xhr, status, errorThrown) {
                    alert("Sorry, there was a problem!");
                    console.log("Error: " + errorThrown);
                    console.log("Status: " + status);
                    console.dir(xhr);
                })
        })
    }
    
    //method to create a post in DOM
    let newPostDom= function(post){
        return $(`
                <ul id="post-${post.post._id}">
                    
                        <li><a class="delete-post-button"  href="/posts/deletepost/${post.post._id}">X</a></li>
                    
                    <li>${post.post.content}</li>
                    <li>${post.user.name}</li>
                    <li>${post.user.email}</li>
                    <li>${post.date}</li>
                    <li>
                        <span>0</span>
                        <span>&nbsp;Likes</span>
                    </li>
                    <li>
                    <h4>Comments</h4>
                     <div class="post-comments">
                           
                                <form action="/comments/new_comment" method="post" class="post-comments-form" id="post-comments-form-${post.post._id}">
                                    <textarea name="content" cols="30" rows="1" placeholder="Your Response...." required></textarea>
                                    <input type="hidden" name="post_id" value="${post.post._id}">
                                    <button type="submit">Comment</button>
                                </form>
                            
                
                            <div id="post-comments-${post.post._id}">
                            </div>
                     </div>
                    </li>
                </ul>
        `)
    }
    
    
    function creComment(newComLink) {
        $(newComLink).submit(function (e) {
            let fid = "#" + $(this).attr('id');
            let newCommentForm = $(fid);

            e.preventDefault();
            $.ajax({
                url: "/comments/new_comment",
                data: newCommentForm.serialize(),
                type: "POST",
                dataType: "json",
            })
                .done(function (json) {
                    console.log(json);
                    let i = "#post-comments-" + json.data.comment.post;
                    console.log(i);
                    let newCom = newCommentDom(json.data)
                    $(i).prepend(newCom);
                    $(fid+" textarea").val("");

                    console.log(newCom.find('.comment-delete-button'));
                    delComment(newCom.find('.comment-delete-button'))
                    toggleLikefun(newCom.find('like-toggle-button'));
                    notification("Comment is Published");
                })
                .fail(function (xhr, status, errorThrown) {
                    alert("Sorry, there was a problem!");
                    console.log("Error: " + errorThrown);
                    console.log("Status: " + status);
                    console.dir(xhr);
                })
        })
    }

    function delComment(delComLink) {
        $(delComLink).click(function (e) {
            e.preventDefault();

            $.ajax({
                url: $(this).attr('href'),
                type: "GET",
            })
                .done(function (json) {

                    console.log(json);
                    let i = '#comments-' + json.data.commentId;
                    $(i).remove();
                    notification("Comment is successfully deleted");
                })
                .fail(function (xhr, status, errorThrown) {
                    alert("Sorry, there was a problem!");
                    console.log("Error: " + errorThrown);
                    console.log("Status: " + status);
                    console.dir(xhr);
                })
        })
    }

    let newCommentDom = function (data) {
        return $(`<ul id="comments-${data.comment._id}">
                
                        <li><a href="/comments/delete_comment?id=${data.comment._id}&postUid=${data.post.user._id}" class="comment-delete-button" >X</a></li>
                    
                    <li>${data.comment.content}</li>
                    <li>${data.user.name}</li>
                    <li>${data.date}</li>
                    <li>
                        <span>0</span>
                        <span>&nbsp;Likes</span>
                    </li>
                    <br>
                </ul>
                `);
    }

    function toggleLikefun(link){
        $(link).click(function(e){
            let k = $(this).text();
            let no= $(this).attr('data-id');
            let nol = parseInt($("#" + no).text());
            
            e.preventDefault();
            $.ajax({
                url: $(this).attr('href'),
                type: "GET"
            }).done(function (json) {
                if(json.data.deleted){
                    nol -=1;
                }else{
                    nol +=1;
                }
                console.log(json);
                $("#" + no).text(nol);
            })
                .fail(function (xhr, status, errorThrown) {
                    alert("Sorry, there was a problem!");
                    console.log("Error: " + errorThrown);
                    console.log("Status: " + status);
                    console.dir(xhr);
                });
        })
    }
    toggleLikefun($('.like-toggle-button'));
    createPost();
    delPost('.delete-post-button');
    creComment('.post-comments-form');
    delComment('.comment-delete-button');

}