import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Pagination } from "@mui/material";

function App() {
  const [comments, setComments] = useState([]);
  const [current, setCurrent] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return Number(params.get("page")) || 1;
  });
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loader = useRef(null);

  useEffect(() => {
    setLoading(true);
    axios
      .get(
        `https://jsonplaceholder.typicode.com/comments?_page=${current}&_limit=2`
      )
      .then((response) => {
        if (response.status === 200) {
          setComments(response.data);
        }
      })
      .finally(() => setLoading(false));

    const params = new URLSearchParams();
    params.set("page", current);
    window.history.replaceState(null, "", `?${params.toString()}`);
  }, [current]);

  useEffect(() => {
    if (!hasMore || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setCurrent((prev) => prev + 1);
        }
      },
      { threshold: 1 }
    );

    if (loader.current) observer.observe(loader.current);

    return () => {
      if (loader.current) observer.unobserve(loader.current);
    };
  }, [loading, hasMore]);

  useEffect(() => {
    if (!loading) return;

    axios
      .get(
        `https://jsonplaceholder.typicode.com/comments?_page=${current}&_limit=2`
      )
      .then((response) => {
        if (response.status === 200) {
          setComments((prevComments) => [...prevComments, ...response.data]);
          setHasMore(response.data.length > 0);
        }
      })
      .finally(() => setLoading(false));
  }, [current, loading]);

  function handlePagination(event, position) {
    setCurrent(position);
  }

  return (
    <div>
      {}
      <div>
        {comments.length > 0 &&
          comments.map((item) => (
            <div key={item.id}>
              <h3>{item.name}</h3>
              <p>{item.body}</p>
            </div>
          ))}
      </div>

      <Pagination
        onChange={handlePagination}
        count={10}
        variant="outlined"
        color="primary"
        page={current}
      />

      <hr />
      <br />
      <br />
      <hr />
      {}
      <div>
        {comments.map((item) => (
          <div key={item.id}>
            <h3>{item.name}</h3>
            <p>{item.body}</p>
          </div>
        ))}
      </div>

      {hasMore && <div ref={loader}>{loading ? "Yuklanmoqda" : "done"}</div>}
      {!hasMore && <div>Barcha ma'lumotlar yuklandi.</div>}
    </div>
  );
}

export default App;
