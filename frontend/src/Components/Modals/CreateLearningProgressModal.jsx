import React, { useState } from "react";
import { Modal, Form, Input, Button, message, Space, Typography } from "antd";
import { useSnapshot } from "valtio";
import state from "../../Utils/Store";
import LearningProgressService from "../../Services/LearningProgressService";

const { Title } = Typography;
const themeColors = {
  primary: "#3066BE", // Rich medium blue as primary color
  secondary: "#4A89DC", // Lighter blue for secondary elements
  accent: "#1E56A0", // Deeper blue for accent elements
  background: "#F0F8FF", // Very light blue tint for background
  surface: "#E6F2FF", // Soft light blue for surfaces
  cardBg: "#FFFFFF", // White background for cards
  textPrimary: "#1A2A3A", // Dark navy for primary text
  textSecondary: "#5D7285", // Blue-gray for secondary text
  border: "rgba(0, 0, 0, 0.12)", // Subtle neutral border
  hover: "#2656A8", // Darker blue for hover effects
  danger: "#DC3545", // Standard red for warnings/errors
  success: "#28A745", // Balanced green for success messages
  gradient: "linear-gradient(135deg, #3066BE 0%, #4A89DC 100%)", // Blue gradient
};

const CreateLearningProgressModal = () => {
  const snap = useSnapshot(state);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();

      // Create Learning Progress data object
      const LearningProgressData = {
        userId: snap.currentUser?.uid,
        planName: values.planName,
        description: values.description,
        goal: values.goal,
        routines: values.routines,
      };

      await LearningProgressService.CreateLearningProgressModal(LearningProgressData);
      state.LearningProgresss = await LearningProgressService.getAllLearningProgresss();
      
      // Success message
      message.success("Learning Progress created successfully!");

      // Reset form and close modal
      form.resetFields();
      state.CreateLearningProgressModalOpened = false;
    } catch (error) {
      console.error("Form validation failed:", error);
      
      // Error message
      message.error("Failed to create Learning Progress. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    state.CreateLearningProgressModalOpened = false;
  };

  return (
    <Modal
      title={<Title level={4}>Share Learning Progress</Title>}
      footer={null}
      visible={snap.CreateLearningProgressModalOpened}
      onCancel={handleCancel}
      width={550}
      centered
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="planName"
          label="Title"
          rules={[{ required: true, message: "Please add a title" }]}
        >
          <Input 
            placeholder="Give a brief title for your progress update" 
            style={{ borderRadius: 8 }}
          />
        </Form.Item>
        
        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: "Please enter description" }]}
        >
          <Input.TextArea 
            placeholder="Describe your recent learning progress" 
            rows={4}
            style={{ borderRadius: 8 }}
          />
        </Form.Item>
        
        <Form.Item
          name="goal"
          label="Tutorials"
          rules={[{ required: true, message: "Please enter tutorials" }]}
        >
          <Input 
            placeholder="Skills you learned from this update" 
            style={{ borderRadius: 8 }}
          />
        </Form.Item>
        
        <Form.Item
          name="routines"
          label="New skills learned"
          rules={[{ required: true, message: "Please enter Skills" }]}
        >
          <Input.TextArea 
            placeholder="Skills you have acquired" 
            rows={3}
            style={{ borderRadius: 8 }}
          />
        </Form.Item>
        
        <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
          <Space style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button 
              onClick={handleCancel}
              style={{ borderRadius: 8, borderColor: themeColors.primary, }}
              
            >
              Cancel
            </Button>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              style={{
                background: themeColors.primary, // #FF6B35 orange
                borderColor: themeColors.primary,
                borderRadius: 8,
                boxShadow: "0 2px 8px rgba(255, 107, 53, 0.2)"
              }}
            >
              {loading ? "Sharing..." : "Share Progress"}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateLearningProgressModal;