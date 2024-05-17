import {
  Drawer,
  Form,
  Input,
  Button,
  InputNumber,
  Switch,
  Col,
  ColorPicker,
} from "antd";
import { useEffect, useState } from "react";

const AddItemForm = ({ visible, onClose, onAddItem, selectedInputDetails }) => {
  const [form] = Form.useForm();
  const [options, setOptions] = useState([]);

  useEffect(() => {
    form.setFieldsValue({
      label: selectedInputDetails.label,
      type: selectedInputDetails.type,
      required: selectedInputDetails.required || false,
    });
  }, [selectedInputDetails]);

  const onFinish = (values) => {
    onAddItem({
      ...selectedInputDetails,
      ...values,
      options,
      labelFontSize: values.labelFontSize,
      labelFontWeight: values.labelFontWeight,
      labelColor: values.labelColor,
    });
    form.resetFields();
    onClose();
  };

  const addOption = () => {
    setOptions([...options, ""]);
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
  };

  const removeOption = (index) => {
    const updatedOptions = [...options];
    updatedOptions.splice(index, 1);
    setOptions(updatedOptions);
  };

  return (
    <Drawer
      title="Edit Input Item"
      placement="right"
      closable={true}
      onClose={onClose}
      visible={visible}
      width={400}
    >
      <Form form={form} onFinish={onFinish}>
        <Form.Item
          name="label"
          label="Label"
          rules={[{ required: true, message: "Label is required" }]}
        >
          <Input placeholder="Enter label" />
        </Form.Item>

        {selectedInputDetails.type === "checkbox" ||
        selectedInputDetails.type === "radio" ||
        selectedInputDetails.type === "select" ? (
          <>
            <Form.Item name="options" label="Options">
              {options.map((option, index) => (
                <div
                  key={index}
                  style={{ display: "flex", marginBottom: "8px" }}
                >
                  <Input
                    value={option || ""}
                    placeholder={`Option ${index + 1}`}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                  />
                  <Button type="danger" onClick={() => removeOption(index)}>
                    Remove
                  </Button>
                </div>
              ))}
            </Form.Item>
            <Button type="dashed" onClick={addOption}>
              Add Option
            </Button>
          </>
        ) : null}

        {selectedInputDetails.type === "slider" ? (
          <>
            <Form.Item name="min" label="Min">
              <InputNumber />
            </Form.Item>
            <Form.Item name="max" label="Max">
              <InputNumber />
            </Form.Item>
          </>
        ) : null}

        {selectedInputDetails.type !== "Button" && (
          <Form.Item name="required" label="Required" valuePropName="checked">
            <Switch />
          </Form.Item>
        )}

        <Form.Item name="labelFontSize" label="Label Font Size">
          <InputNumber />
        </Form.Item>
        <Form.Item name="labelFontWeight" label="Label Font Weight">
          <InputNumber />
        </Form.Item>

        <Form.Item name="labelColor" label="Label Color">
          <ColorPicker />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Save Changes
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default AddItemForm;
