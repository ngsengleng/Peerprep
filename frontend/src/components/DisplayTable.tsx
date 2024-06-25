import { useState, useCallback, useEffect, ReactNode } from "react";
interface DisplayTableProps<T> {
  rawData: T[];
  hasPagination: boolean;
}
export default function DisplayTable<T extends ReactNode>(
  props: DisplayTableProps<T>
) {
  const limit: number = 5;
  const [paginationState, setPaginationState] = useState<number>(0);
  const [paginationData, setPaginationData] = useState<T[]>([]);
  const [paginationIndexes, setPaginationIndexes] = useState<number[]>([]);

  const handlePagination = useCallback(
    (position: number) => {
      const newPaginationData: T[] = props.rawData.slice(
        (position - 1) * limit,
        position * limit > props.rawData.length
          ? props.rawData.length
          : position * limit
      );
      setPaginationState(position);
      setPaginationData(newPaginationData);
    },
    [props.rawData]
  );
  const jumpStart = () => {
    handlePagination(paginationIndexes[0]);
  };
  const jumpEnd = () => {
    handlePagination(paginationIndexes.slice(-1)[0]);
  };
  useEffect(() => {
    const arr: number[] = [];
    for (let i = 0; i < Math.ceil(props.rawData.length / limit); i++) {
      arr.push(i + 1);
    }
    handlePagination(1);
    setPaginationIndexes(arr);
  }, [props.rawData, handlePagination]);
  return (
    <>
      <h3>Most recently solved questions</h3>
      <div className="display-table-container">
        <table className="display-table">
          <tbody>
            {paginationData.map((v, index) => {
              return (
                <tr key={index}>
                  <td
                    className={
                      index % 2 === 0
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
      {props.hasPagination && (
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
                    paginationState === v
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
      )}
    </>
  );
}
