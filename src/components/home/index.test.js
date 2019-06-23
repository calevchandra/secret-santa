import React from "react";
import Adapter from "enzyme-adapter-react-16";
import renderer from "react-test-renderer";
import { configure, shallow } from "enzyme";
import ViewStaff from "./ViewStaff";
import GiftPartners from "./GiftPartners";
import Home from "./index";

configure({ adapter: new Adapter() });

const test_staff_data = [
  { id: "_uhkqzgaos", name: "calev", email: "cbkavit@gmail.com" },
  { id: "_fcjnf1rkv", name: "caleb", email: "cbkavit@gmail.com" },
  { id: "_1aku7ekkn", name: "john", email: "cbkavit@gmail.com" },
  { id: "_gdiaqc0l6", name: "jerry", email: "cbkavit@gmail.com" },
  { id: "_qvl7ofesg", name: "sera", email: "cbkavit@gmail.com" },
  { id: "_v166hbko0", name: "tui", email: "cbkavit@gmail.com" },
  { id: "_zkesxrlpw", name: "jane", email: "cbkavit@gmail.com" },
  { id: "_x49fblif7", name: "jack", email: "cbkavit@gmail.com" },
  { id: "_7ugu9xzpj", name: "sam", email: "cbkavit@gmail.com" },
  { id: "_li6iqjfe7", name: "bob", email: "cbkavit@gmail.com" }
];

let home = new Home();

const minPropsViewStaffs = {
  deleteParticipant: () => {},
  handleEditChange: () => {},
  saveParticipant: () => {},
  staffData: test_staff_data,
  formValid: []
};

const minPropsGiftPartners = {
  assignGiftPartners: () => {},
  giftExchange: [],
  resetGiftExchange: () => {}
};

describe("Main Page", () => {
  it("renders without exploding", () => {
    expect(shallow(<Home />).length).toEqual(1);
  });
  it("renders as expected", () => {
    const tree = renderer.create(<Home />).toJSON();

    expect(tree).toMatchSnapshot();
  });
});

describe("The View Staff list", () => {
  it("renders without exploding", () => {
    expect(shallow(<ViewStaff {...minPropsViewStaffs} />).length).toEqual(1);
  });
  it("renders as expected", () => {
    const tree = renderer
      .create(<ViewStaff {...minPropsViewStaffs} />)
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
  /*it("should add staff to the listing", () => {
    //expect(true).toEqual(true);
    // home.state.staff_data = test_staff_data;
    home.state({
      staff_data: test_staff_data,
      staffName: "Tim",
      emailAdd: "cbkavit@gmail.com"
    });
    home.handleAddParticipant({ target: { value: "h" } });
    expect(home.state.staff_data.length).toEqual(11);
  });*/
});

describe("Assign Partner list", () => {
  it("renders without exploding", () => {
    expect(shallow(<GiftPartners {...minPropsGiftPartners} />).length).toEqual(
      1
    );
  });
  it("renders as expected", () => {
    const tree = renderer
      .create(<GiftPartners {...minPropsGiftPartners} />)
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
});
