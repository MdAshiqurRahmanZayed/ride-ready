import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { fetchAllCategory } from "../../redux/actions";
import Loading from "../Loading/Loading";

const mapStateToProps = (state) => ({
  token: state.token,
  all_category: state.all_category,
  isLoading: state.isLoading,
});

const mapDispatchToProps = (dispatch) => ({
  fetchAllCategory: () => dispatch(fetchAllCategory()),
});

const AllCategory = ({
  all_category,
  fetchAllCategory,
  isLoading,
  onSelectCategory,
}) => {
  useEffect(() => {
    fetchAllCategory();
  }, [fetchAllCategory]);

  const [showAll, setShowAll] = useState(false);

  const toggleShowAll = () => {
    setShowAll(!showAll);
  };

  return (
    <div>
      <h2>All Categories</h2>
      {isLoading ? (
        <Loading />
      ) : (
        <div>
          <div
            className="btn btn-primary my-2"
            onClick={() => onSelectCategory(0)}
          >
            All
          </div>
          <div className="dropdown">
            <div
              className="btn btn-primary dropdown-toggle my-2"
              onClick={toggleShowAll}
            >
              Show All
            </div>
            <div className={`dropdown-menu ${showAll ? "show" : ""}`}>
              {all_category.map((category) => (
                <div
                  className="dropdown-item"
                  key={category.id}
                  onClick={() => onSelectCategory(category.id)}
                >
                  {category.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(AllCategory);
