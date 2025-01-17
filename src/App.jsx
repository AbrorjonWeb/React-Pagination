import React, { useEffect, useState } from "react";
import { Pagination } from "@mui/material";
import axios from "axios";

function App() {
  const [comments, setComments] = useState([]);
  const [current, setCurrent] = useState(1);

  useEffect(() => {
    axios
      .get(
        `https://jsonplaceholder.typicode.com/comments?_page=${current}&_limit=2`
      )
      .then((response) => {
        if (response.status === 200) {
          setComments(response.data);
        }
      });
  }, [current]);

  function handlePagination(event, position) {
    setCurrent(position);
  }

  return (
    <div>
      <div className="container mx-auto mt-10">
        {comments.length > 0 &&
          comments.map((item, index) => {
            return (
              <div key={index} className="p-3 border rounded-md shadow-md">
                <h3>{item.name}</h3>
                <p>{item.body}</p>
              </div>
            );
          })}
      </div>

      <Pagination
        onChange={handlePagination}
        count={10}
        variant="outlined"
        color="primary"
      />
    </div>
  );
}

export default App;
