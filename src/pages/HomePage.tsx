import { useCallback, useEffect, useState } from "react";

export default function HomePage() {
  const [rawData, setRawData] = useState<number[]>([
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
  ]); // placeholder max should be only 5
  const [paginationState, setPaginationState] = useState<number>(0);
  const [paginationData, setPaginationData] = useState<number[]>([]);
  const [paginationIndexes, setPaginationIndexes] = useState<number[]>([]);
  const limit: number = 5;
  const handlePagination = useCallback(
    (position: number) => {
      const newPaginationData: number[] = rawData.slice(
        (position - 1) * limit,
        position * limit > rawData.length ? rawData.length : position * limit
      );
      setPaginationState(position);
      setPaginationData(newPaginationData);
    },
    [rawData]
  );
  const jumpStart = () => {
    handlePagination(paginationIndexes[0]);
  };
  const jumpEnd = () => {
    handlePagination(paginationIndexes.slice(-1)[0]);
  };
  useEffect(() => {
    const arr: number[] = [];
    for (let i = 0; i < Math.ceil(rawData.length / limit); i++) {
      arr.push(i + 1);
    }
    handlePagination(1);
    setPaginationIndexes(arr);
  }, [rawData, handlePagination]);
  return (
    <>
      <div className="home-title">
        <h1>Start practicing today!</h1>
      </div>
      <div className="home-button-group">
        <button className="home-redirect-button">
          <b>Start a new session</b>
        </button>
        <button className="home-redirect-button">
          <b>Join an existing room</b>
        </button>
      </div>
      <h3>Most recently solved questions</h3>
      <div className="display-table-container">
        <table className="display-table">
          <tbody>
            {paginationData.map((v) => {
              return (
                <tr key={v}>
                  <td
                    className={
                      v % 2 == 0
                        ? "display-table-row--even"
                        : "display-table-row--odd"
                    }
                  >
                    <b>Top {v} Frequent Elements</b>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <nav className="pagination-container">
        <ul className="pagination">
          <li className="pagination-button--unselected" onClick={jumpStart}>
            <a>«</a>
          </li>
          {paginationIndexes.map((v) => {
            return (
              <li
                onClick={() => handlePagination(v)}
                key={v}
                className={
                  paginationState == v
                    ? "pagination-button--selected"
                    : "pagination-button--unselected"
                }
              >
                <a>{v}</a>
              </li>
            );
          })}
          <li className="pagination-button--unselected" onClick={jumpEnd}>
            <a>»</a>
          </li>
        </ul>
      </nav>
    </>
  );
}
