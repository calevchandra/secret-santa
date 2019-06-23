import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Table, FormControl } from "react-bootstrap";

const ViewStaff = ({
  handleEditChange,
  deleteParticipant,
  saveParticipant,
  staffData,
  formValid
}) => {
  const [indexValue, setIndexValue] = useState("");
  const [edit, setEdit] = useState(false);

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {staffData
          ? staffData.map((data, idx) => {
              return (
                <tr key={idx}>
                  <td>
                    {edit && indexValue === idx ? (
                      <FormControl
                        className={
                          !formValid.staffName ? "border border-danger" : null
                        }
                        name="editStaffName"
                        value={data.name}
                        onChange={e => handleEditChange(data.id, e)}
                      />
                    ) : (
                      data.name.charAt(0).toUpperCase() + data.name.slice(1)
                    )}
                  </td>
                  <td>
                    {edit && indexValue === idx ? (
                      <FormControl
                        className={
                          !formValid.staffEmail ? "border border-danger" : null
                        }
                        name="editStaffEmail"
                        value={data.email}
                        onChange={e => handleEditChange(data.id, e)}
                      />
                    ) : (
                      data.email
                    )}
                  </td>
                  <td>
                    {edit && indexValue === idx ? (
                      <Button
                        onClick={() => {
                          saveParticipant(data.name, data.email);
                          formValid.staffEmail ? setEdit(false) : setEdit(true);
                          setIndexValue("");
                        }}
                        variant="success"
                      >
                        Save
                      </Button>
                    ) : (
                      <>
                        <Button
                          onClick={() => {
                            setEdit(true);
                            setIndexValue(idx);
                            //enableEditParticipant(data.name, data.email)
                          }}
                          style={{ paddingRight: 20 }}
                          variant="warning"
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => deleteParticipant(idx)}
                          variant="info"
                        >
                          Delete
                        </Button>
                      </>
                    )}
                  </td>
                </tr>
              );
            })
          : null}
      </tbody>
    </Table>
  );
};

ViewStaff.propTypes = {
  handleEditChange: PropTypes.func.isRequired,
  deleteParticipant: PropTypes.func.isRequired,
  saveParticipant: PropTypes.func.isRequired,
  staffData: PropTypes.array.isRequired,
  formValid: PropTypes.oneOfType([PropTypes.array, PropTypes.object])
};

export default ViewStaff;
