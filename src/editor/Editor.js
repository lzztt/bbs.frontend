import React, { useRef, useState } from "react";

import { styled } from '@mui/material/styles';
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
// import ReactMarkdown from "react-markdown";
import {
  decodeHtmlSpecialChars,
  randomId,
  rest,
  scrollTo,
  validateResponse,
} from "../lib/common";
import TextField from "@mui/material/TextField";
import Image from "./Image";

import ImageBlobReduce from "image-blob-reduce";

window.app.delete = function (type, nodeId) {
  const answer = window.confirm("此操作不可恢复，您确认要删除该内容吗？");
  if (answer) {
    window.location = `/${type}/${nodeId}/delete`;
  }
};

const Root = styled("div")({
  maxWidth: "900px",
  margin: "1rem auto",
  padding: "1rem",
  border: "1px solid gray",
  borderRadius: "0.5rem",
});

const TitleDiv = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",

  [theme.breakpoints.up("sm")]: {
    flexDirection: "row-reverse",
  },
}));

const HalfWidthTextField = styled(TextField)(({ theme }) => ({
  width: "100%",

  [theme.breakpoints.up("sm")]: {
    width: "50%",
  },
}));

const ImgDiv = styled("div")({
  display: "flex",
  flexFlow: "row wrap",
  alignItems: "flex-end",
});

const SubmitDiv = styled("div")({
  marginTop: "0.5rem",
});

function Editor() {
  const [formId, setFormId] = useState("");
  const [data, setData] = useState(null);
  const [url, setUrl] = useState("");
  const [submit, setSubmit] = useState("");

  const fileInputRef = useRef(null);

  window.app.openNodeEditor = ({
    nodeId = null,
    tagId = null,
    title = "",
    body = "",
    images = [],
  } = {}) => {
    if (title) {
      title = decodeHtmlSpecialChars(title);
    }
    if (body) {
      body = decodeHtmlSpecialChars(body);
    }

    if (nodeId) {
      setUrl(`/node/${nodeId}/edit`);
      setSubmit("更新话题");
    } else {
      setUrl(`/forum/node`);
      setSubmit("发布新话题");
    }
    setData({
      tagId,
      title,
      body,
      images: images.map((image) => ({
        ...image,
        src: image.path,
        code: `[img]${image.path}[/img]`,
      })),
    });
    setFormId(randomId());

    scrollTo(document.body.scrollHeight);
  };

  window.app.openCommentEditor = ({
    nodeId = null,
    commentId = null,
    body = "",
    images = [],
  } = {}) => {
    if (body) {
      body = decodeHtmlSpecialChars(body);
    }

    if (commentId) {
      setUrl(`/comment/${commentId}/edit`);
      setSubmit("更新评论");
    } else if (nodeId) {
      setUrl(`/node/${nodeId}/comment`);
      setSubmit("发布新评论");
    } else {
      return;
    }
    setData({
      body,
      images: images.map((image) => ({
        ...image,
        src: image.path,
        code: `[img]${image.path}[/img]`,
      })),
    });
    setFormId(randomId());

    scrollTo(document.body.scrollHeight);
  };

  if (!data) {
    return "";
  }

  const handleTagChange = (event) => {
    setData({
      ...data,
      tagId: event.target.value,
    });
  };

  const handleTitleChange = (event) => {
    setData({
      ...data,
      title: event.target.value,
    });
  };

  const handleBodyChange = (event) => {
    setData({
      ...data,
      body: event.target.value,
    });
  };

  const fileInputChange = (event) => {
    var fileInput = event.target;
    var file = fileInput.files[0];
    if (!file) {
      return;
    }

    const reducer = new ImageBlobReduce();
    reducer
      .toBlob(file, {
        max: 600,
        unsharpAmount: 80,
        unsharpRadius: 0.6,
        unsharpThreshold: 2,
      })
      .then(function (blob) {
        fileInput.value = null;
        const tmp = [
          ...data.images,
          {
            name: file.name,
            src: URL.createObjectURL(blob),
            blob,
          },
        ];
        setData({
          ...data,
          images: tmp,
        });
      });
  };

  function updateImageName(index, name) {
    const tmp = [...data.images];
    tmp[index].name = name;
    setData({
      ...data,
      images: tmp,
    });
  }

  function deleteImage(index) {
    const tmp = [...data.images];
    tmp.splice(index, 1);
    setData({
      ...data,
      images: tmp,
    });
  }

  const postMessage = (event) => {
    var formData = new FormData();
    if ("title" in data) {
      if (data.title.length < 5) {
        alert("标题太短了");
        return;
      }
      formData.append("title", data.title);
      formData.append("tagId", data.tagId);
    }

    if (data.body.length < 5) {
      alert("正文太短了");
      return;
    }
    formData.append("body", data.body);
    formData.append("update_file", 1);
    data.images.forEach((image) => {
      if ("blob" in image) {
        const id = randomId().substring(0, 3);
        formData.append(id, image.blob, id);
        formData.append("file_id[]", id);
      } else {
        formData.append("file_id[]", image.id);
      }
      formData.append("file_name[]", image.name);
    });
    formData.append("formId", formId);

    rest
      .post(url, formData)
      .then((data) => {
        if (validateResponse(data) && data.redirect) {
          var a = document.createElement("a");
          a.href = data.redirect;

          if (
            window.location.href.replace(/#.*/, "") ===
            a.href.replace(/#.*/, "")
          ) {
            window.location.reload();
          } else {
            window.location.assign(a.href);
          }
        }
      })
      .catch((error) => {
        alert(error);
      });
  };

  return (
    <Root>
      {"title" in data && (
        <TitleDiv>
          <HalfWidthTextField
            required
            select
            value={data.tagId}
            onChange={handleTagChange}
            label="讨论区"
            placeholder="话题的讨论区"
          >
            {window.app.navTags.map((tagId) => (
              <MenuItem key={tagId.id} value={tagId.id}>
                {tagId.name}
              </MenuItem>
            ))}
          </HalfWidthTextField>
          <HalfWidthTextField
            required
            value={data.title}
            onChange={handleTitleChange}
            label="标题"
            placeholder="话题的标题"
          />
        </TitleDiv>
      )}
      <TextField
        required
        fullWidth
        multiline
        value={data.body}
        onChange={handleBodyChange}
        label="正文"
        placeholder="支持纯文本和Markdown格式"
      />
      {/* <ReactMarkdown className="preview" source={body} /> */}
      <div style={{ margin: "0.5rem 0" }}>
        <ImgDiv>
          {data.images &&
            data.images.map((image, index) => (
              <Image
                key={index}
                {...image}
                {...{ index, updateImageName, deleteImage }}
              />
            ))}
        </ImgDiv>
        <input
          ref={fileInputRef}
          style={{ display: "none" }}
          id="file_input"
          type="file"
          onChange={fileInputChange}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={() => fileInputRef.current.click()}
        >
          上传图片
        </Button>
      </div>
      <SubmitDiv>
        <Button variant="contained" color="primary" onClick={postMessage}>
          {submit}
        </Button>
      </SubmitDiv>
    </Root>
  );
}

export default Editor;
