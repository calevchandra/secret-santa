import React from "react";
import store from "store";
import { toast } from "react-toastify";
//import "bootstrap/dist/css/bootstrap.css";
import {
  Container,
  Col,
  Button,
  Form,
  Card,
  Tabs,
  Tab,
  Alert
} from "react-bootstrap";

import ViewStaff from "./ViewStaff";
import GiftPartners from "./GiftPartners";
export const VALID_DATA = 0;
export const INVALID_DATA = 1;

class Home extends React.Component {
  state = {
    staffName: "",
    emailAdd: "",
    staff_data: [],
    editStaffName: "",
    editStaffEmail: "",
    formValidity: {
      staffName: true,
      staffEmail: true
    },
    giftPartners: []
  };

  componentWillMount() {
    this.getStaffListFromStore();
  }

  render() {
    const {
      staffName,
      emailAdd,
      staff_data,
      formValidity,
      giftPartners
    } = this.state;

    //to assign a partner to a staff, there must be an even number of staffs added.
    const assignPartner =
      staff_data && staff_data.length % 2 === 0 ? false : true;
    return (
      <div>
        <Container>
          <h1>Secret Santa</h1>
          <Tabs
            defaultActiveKey="list"
            onSelect={() => {
              this.getStaffListFromStore();
              this.setState({ giftPartners: [] });
            }}
            transition={false}
          >
            <Tab style={{ padding: 30 }} eventKey="list" title="Participation">
              <Card bg="secondary" text="white">
                <Card.Body>
                  <Form style={{ padding: 20 }}>
                    <Form.Row>
                      <Form.Group as={Col} controlId="formGridName">
                        <Form.Control
                          className={
                            !formValidity.staffName
                              ? "border border-danger"
                              : null
                          }
                          size="lg"
                          type="input"
                          name="staffName"
                          value={staffName}
                          onChange={this.handleOnChange}
                          placeholder="Enter Name"
                        />
                      </Form.Group>
                      <Form.Group as={Col} controlId="formGridEmail">
                        <Form.Control
                          className={
                            !formValidity.staffEmail
                              ? "border border-danger"
                              : null
                          }
                          size="lg"
                          type="email"
                          name="emailAdd"
                          value={emailAdd}
                          onChange={this.handleOnChange}
                          placeholder="Email"
                        />
                      </Form.Group>
                    </Form.Row>
                    <Button
                      onClick={this.handleAddParticipant}
                      variant="dark"
                      type="submit"
                      size="lg"
                      block
                    >
                      Add
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
              <div style={{ paddingTop: 50 }} />
              {staff_data && staff_data.length > 0 ? (
                <ViewStaff
                  handleChange={this.handleOnChange}
                  handleEditChange={this.handleEditOnChange}
                  deleteParticipant={this.handleDeleteParticipant}
                  saveParticipant={this.handleSaveParticipant}
                  staffData={staff_data}
                  formValid={formValidity}
                />
              ) : (
                <Alert variant="info">No staffs added yet</Alert>
              )}
            </Tab>
            <Tab eventKey="draw" title="Gift Partner" disabled={assignPartner}>
              <GiftPartners
                staffData={staff_data}
                assignGiftPartners={this.handleAssignGiftPartners}
                giftExchange={giftPartners ? giftPartners : null}
                resetGiftExchange={this.handleResetGiftExchange}
                assignButtonDisable={false}
              />
            </Tab>
          </Tabs>
        </Container>
      </div>
    );
  }

  /**
   * handleAssignGiftPartners makes sure a staff is allocated to a partner
   * for gift exchange. It will loop through all the staffs and randomly
   * assign another person to it.
   */
  handleAssignGiftPartners = () => {
    const { staff_data } = this.state;
    const partners = [...staff_data];
    console.log("partners", partners);
    const giftPartners = staff_data.map(user => {
      //call randAssign by passing partners
      let partner = {
        name: "na"
      };

      if (partners.length > 0) {
        partner = this.randomlyPickPartner(user.id, partners);

        //find index using user id
        const index = partners.findIndex(data => {
          return data.id === partner.id;
        });
        partners.splice(index, 1);
      }

      return { name: user.name, email: user.email, giftTo: partner.name };
    });

    this.setState({
      giftPartners
    });
  };

  /**
   * randomlyPickPartner is used by handleAssignGiftPartners to
   * generate a person from the partners parameter provided given
   * it has not been allocated yet and returns their details to the
   * handleAssignGiftPartners
   */
  randomlyPickPartner = (id_current_staff, partners) => {
    const copyOfPartners = [...partners];
    const randomStaffIndex =
      Math.floor(Math.random() * copyOfPartners.length) + 0;

    let giftingTo = undefined;
    if (
      copyOfPartners.length > 0 &&
      copyOfPartners[randomStaffIndex].id === id_current_staff
    ) {
      return this.randomlyPickPartner(id_current_staff, copyOfPartners);
    }

    giftingTo = {
      name: copyOfPartners[randomStaffIndex].name,
      id: copyOfPartners[randomStaffIndex].id,
      index: randomStaffIndex
    };
    return giftingTo;
  };

  /**
   * handleOnChange stores to state any changes when typing in the input fields
   * for adding staff data only
   */
  handleOnChange = e => {
    const { name, value } = e.target;
    this.setState({
      [name]: value
    });
  };

  /**
   * handleAddParticipant checks the data stored with handleOnChange method
   * and validates it to make sure data is properly formatted. It then stores
   * the staff data to the local store
   */
  handleAddParticipant = e => {
    const { staff_data, staffName, emailAdd } = this.state;
    e.preventDefault();

    //validate staff data
    if (
      this.validateParticipantData(staffName, emailAdd, false) === VALID_DATA
    ) {
      const newStaff = {
        id:
          "_" +
          Math.random()
            .toString(36)
            .substr(2, 9),
        name: staffName,
        email: emailAdd
      };
      //append new staff to array
      const addStaff = staff_data ? [...staff_data, newStaff] : [newStaff];

      //save to store
      store.set("staff_data", addStaff);
      toast.success("Staff added.");
      this.setState({
        staff_data: addStaff,
        staffName: "",
        emailAdd: ""
      });
    }
  };

  /**
   * handleEditOnChange is solely responsible for storing any edits done
   * to the staff data
   */
  handleEditOnChange = (id, e) => {
    const { name, value } = e.target;
    const { staff_data } = this.state;

    const index = staff_data.findIndex(user => {
      return user.id === id;
    });

    const staff = Object.assign({}, staff_data[index]);
    if (name === "editStaffName") staff.name = value;
    else if (name === "editStaffEmail") staff.email = value;

    const staffData = [...staff_data];
    staffData[index] = staff;

    this.setState({
      staff_data: staffData
    });
  };

  /**
   * handleSaveParticipant commits the data when user clicks save after editing
   * the data. But first, it validates the edited data and then stores the staff
   *  data to the local store.
   */
  handleSaveParticipant = (staffName, staffEmail) => {
    const { staff_data } = this.state;

    if (
      this.validateParticipantData(staffName, staffEmail, true) === VALID_DATA
    ) {
      store.set("staff_data", staff_data);
      this.setState({
        editStaffName: "",
        editStaffEmail: ""
      });
    } else this.getStaffListFromStore();
  };

  /**
   * handleDeleteParticipant get the index of the staff data passed by the on click
   * event of the delete button, finds the staff and deletes it.
   */
  handleDeleteParticipant = index => {
    const staffData = [...this.state.staff_data];
    staffData.splice(index, 1);

    //update store
    store.set("staff_data", staffData);

    this.setState({
      staff_data: staffData
    });
    //show message to user
    toast.info("Staff removed.");
  };

  /**
   * getStaffListFromStore basically refreshes the staff data by getting the committed
   * data from the local store and storing in state.
   */
  getStaffListFromStore = () => {
    this.setState({
      staff_data: store.get("staff_data")
    });
  };

  /**
   * validateParticipantData is used when adding or editing data. Before any commits
   * are done, it must first be validated against this method to ensure data is
   * consistent.
   */
  validateParticipantData = (staffName, emailAdd, editStaff) => {
    let response = VALID_DATA;
    const { formValidity, staff_data } = this.state;
    const formValid = { ...formValidity };

    //email should have @ symbol present to be valid
    const emailValid = emailAdd.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
    if (!emailValid) {
      formValid.staffEmail = false;
      response = INVALID_DATA;
    } else formValid.staffEmail = true;

    //staff name should be at least 2 characters
    if (staffName.length < 2) {
      formValid.staffName = false;
      response = INVALID_DATA;
    } else formValid.staffName = true;

    //check if staff does not already exist
    const duplicateStaff = staff_data
      ? staff_data.filter(
          user =>
            user.name.toLowerCase() === staffName.toLowerCase() &&
            user.email.toLowerCase() === emailAdd.toLowerCase()
        )
      : undefined;

    //when editing staff, there can be one duplicate which is okay as the edited
    //data is stored on state when onChange method is called during editing.
    //However, when adding data, there should not be any duplicates present.
    if (duplicateStaff === undefined) formValid.duplicate = false;
    else if (editStaff && duplicateStaff.length > 1) {
      response = INVALID_DATA;
      toast.error("Staff already exists.");
    } else if (!editStaff && duplicateStaff.length === 1) {
      response = INVALID_DATA;
      toast.error("Staff already exists.");
    }

    this.setState({
      formValidity: formValid
    });
    return response;
  };

  /**
   * Once staffs are notified of the gift exchange, state is reset
   */
  handleResetGiftExchange = () => {
    this.setState({ giftPartners: [] });
  };
}

export default Home;
