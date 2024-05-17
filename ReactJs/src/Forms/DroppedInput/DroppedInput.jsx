import React from "react";
import {
  Col,
  Button,
  Form,
  DatePicker,
  Select,
  Input,
  Slider,
  Upload,
  InputNumber,
  Checkbox,
  Radio,
} from "antd";
import { EditOutlined } from "@ant-design/icons";
import uploadImage from "../../assets/Group 67 (1).svg";
const { TextArea } = Input;
const { Dragger } = Upload;
import PhoneInput from "react-phone-input-2";

const DroppedInput = ({
  id,
  label,
  type,
  options,
  required,
  showDrawer,
  labelColor,
  labelFontSize,
  labelFontWeight,
}) => {
  let inputComponent;
  switch (type) {
    case "text":
      inputComponent = (
        <Form.Item
          label={
            <span
              style={{
                fontSize: labelFontSize,
                fontWeight: labelFontWeight,
                color: labelColor,
              }}
            >
              {label}
            </span>
          }
          name={id}
          // rules={[{ required, message: `${label} is required` }]}
        >
          <Input placeholder={label} />
        </Form.Item>
      );
      break;
    case "number":
      inputComponent = (
        <Form.Item
          label={label}
          name={id}
          // rules={[{ required, message: `${label} is required` }]}
        >
          <InputNumber placeholder={label} style={{ width: "100%" }} />
        </Form.Item>
      );
      break;
    case "date":
      inputComponent = (
        <Form.Item
          label={label}
          name={id}
          // rules={[{ required, message: `${label} is required` }]}
        >
          <DatePicker placeholder={label} style={{ width: "100%" }} />
        </Form.Item>
      );
      break;
    case "checkbox":
      inputComponent = (
        <Form.Item
          label={label}
          name={id}
          // rules={[{ required, message: `${label} is required` }]}

          valuePropName="checked"
          initialValue={options && options.includes(label)}
        >
          <Checkbox.Group options={options} />
        </Form.Item>
      );
      break;
    case "radio":
      inputComponent = (
        <Form.Item
          label={label}
          name={id}
          // rules={[{ required, message: `${label} is required` }]}

          valuePropName="checked"
          initialValue={options && options.includes(label)}
        >
          <Radio.Group options={options} />
        </Form.Item>
      );
      break;
    case "select":
      inputComponent = (
        <Form.Item
          label={label}
          // rules={[{ required, message: `${label} is required` }]}

          name={id}
          initialValue={options && options[0]}
        >
          <Select>
            {options &&
              options.map((option) => (
                <Select.Option key={option} value={option}>
                  {option}
                </Select.Option>
              ))}
          </Select>
        </Form.Item>
      );
      break;
    case "password":
      inputComponent = (
        <Form.Item
          label={label}
          // rules={[{ required, message: `${label} is required` }]}

          name={id}
        >
          <Input
            placeholder={label}
            style={{ width: "100%" }}
            type="password"
          />
        </Form.Item>
      );
      break;
    case "email":
      inputComponent = (
        <Form.Item
          label={label}
          // rules={[{ required, message: `${label} is required` }]}

          name={id}
        >
          <Input placeholder={label} style={{ width: "100%" }} />
        </Form.Item>
      );
      break;
    case "phone":
      inputComponent = (
        <Form.Item
          label={label}
          // rules={[{ required, message: `${label} is required` }]}

          name={id}
        >
          <PhoneInput placeholder={label} style={{ width: "100%" }} />
        </Form.Item>
      );
      break;
    case "upload":
      inputComponent = (
        <Form.Item
          label={label}
          rules={[{ required, message: `${label} is required` }]}
          name={id}
        >
          <Dragger
            name="file"
            multiple={true}
            action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
          >
            <p className="ant-upload-drag-icon">
              <img src={uploadImage} />
            </p>
            <p className="ant-upload-text">
              Click or drag file to this area to upload
            </p>
            <p className="ant-upload-hint">
              Support for a single or bulk upload. Strictly prohibited from
              uploading company data or other banned files.
            </p>
          </Dragger>
        </Form.Item>
      );
      break;

    case "month":
      inputComponent = (
        <Form.Item
          label={label}
          // rules={[{ required, message: `${label} is required` }]}

          name={id}
        >
          <DatePicker
            placeholder={label}
            picker="month"
            style={{ width: "100%" }}
          />
        </Form.Item>
      );
      break;
    case "week":
      inputComponent = (
        <Form.Item
          label={label}
          // rules={[{ required, message: `${label} is required` }]}

          name={id}
        >
          <DatePicker
            placeholder={label}
            picker="week"
            style={{ width: "100%" }}
          />
        </Form.Item>
      );
      break;
    case "year":
      inputComponent = (
        <Form.Item
          label={label}
          // rules={[{ required, message: `${label} is required` }]}

          name={id}
        >
          <DatePicker
            placeholder={label}
            picker="year"
            style={{ width: "100%" }}
          />
        </Form.Item>
      );
      break;
    case "time":
      inputComponent = (
        <Form.Item
          label={label}
          // rules={[{ required, message: `${label} is required` }]}

          name={id}
        >
          <DatePicker
            placeholder={label}
            picker="time"
            style={{ width: "100%" }}
          />
        </Form.Item>
      );
      break;
    case "slider":
      inputComponent = (
        <Form.Item
          label={label}
          // rules={[{ required, message: `${label} is required` }]}

          name={id}
        >
          <Slider placeholder={label} style={{ width: "100%" }} />
        </Form.Item>
      );
      break;
    case "TextArea":
      inputComponent = (
        <Form.Item
          label={label}
          // rules={[{ required, message: `${label} is required` }]}

          name={id}
        >
          <TextArea placeholder={label} style={{ width: "100%" }} />
        </Form.Item>
      );
      break;
    case "Button":
      inputComponent = <Button> {label}</Button>;
      break;
    default:
      inputComponent = null;
  }
  return (
    <Col style={{ marginBottom: "8px" }} lg={22}>
      {inputComponent}
    </Col>
  );
};

export default DroppedInput;
