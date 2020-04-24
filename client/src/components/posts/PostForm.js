import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { addPost } from "../../actions/post";

const PostForm = ({ addPost }) => {
  /* The state of this text is in this component because it is only being used in this
    component to reflect the text that is being typed*/
  const [text, setText] = useState("");
  return (
    <div class="post-form">
      <div class="bg-primary p">
        <h3>Leave A Comment</h3>
      </div>
      <form
        class="form my-1"
        onSubmit={(e) => {
          e.preventDefault();
          addPost({ text });
          setText("");
        }}
      >
        <textarea
          name="text"
          cols="30"
          rows="5"
          placeholder="Comment on this post"
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        ></textarea>
        <input type="submit" class="btn btn-dark my-1" value="Submit" />
      </form>
    </div>
  );
};

PostForm.propTypes = {
  addPost: PropTypes.func.isRequired,
};

export default connect(null, { addPost })(PostForm);
