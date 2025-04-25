import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Button, Space, Typography, message } from "antd";
import { useSnapshot } from "valtio";
import state from "../../Utils/Store";
import LearningProgressService from "../../Services/LearningProgressService";

const { TextArea } = Input;
const { Title } = Typography;

// Theme colors from your existing component
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

const EditLearningProgressModal = () => {
  const snap = useSnapshot(state);
  const selectedPlan = snap.selectedLearningProgress;
  const [updateLoading, setUpdateLoading] = useState(false);
  const [form] = Form.useForm();

  // Reset form fields when selected plan changes
  useEffect(() => {
    if (selectedPlan && form) {
      form.setFieldsValue({
        planName: selectedPlan.planName,
        description: selectedPlan.description,
        routines: selectedPlan.routines,
        goal: selectedPlan.goal,
      });
    }
  }, [selectedPlan, form]);

  const updateLearningProgress = async (values) => {
    try {
      setUpdateLoading(true);
      // Prepare data for update
      const body = { 
        ...values, 
        userId: snap.currentUser?.uid,
        lastUpdated: new Date().toISOString().split('T')[0],
        // Preserve existing values for fields we're not updating
        category: selectedPlan.category,
        completedItems: selectedPlan.completedItems,
        totalItems: selectedPlan.totalItems
      };
      
      await LearningProgressService.updateLearningProgress(selectedPlan.id, body);
      
      // Update the state without page refresh
      const updatedPlans = await LearningProgressService.getAllLearningProgresss();
      state.LearningProgresss = updatedPlans;
      
      // Update the selected plan in state with new values
      const updatedPlan = updatedPlans.find(plan => plan.id === selectedPlan.id);
      if (updatedPlan) {
        state.selectedLearningProgress = updatedPlan;
      }
      
      // Close the modal
      state.editLearningProgressOpened = false;
      
      // Success message
      message.success("Learning Progress updated successfully!");
    } catch (error) {
      console.error("Failed to update Learning Progress:", error);
      
      // Error message
      message.error("Failed to update Learning Progress. Please try again.");
    } finally {
      setUpdateLoading(false);
    }
  };

  return (
    <Modal
      title={<Title level={4} style={{ color: themeColors.textPrimary }}>Edit Learning Plan</Title>}
      open={snap.editLearningProgressOpened}
      onCancel={() => {
        state.editLearningProgressOpened = false;
        form.resetFields();
      }}
      footer={null}
      destroyOnClose={true}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={updateLearningProgress}
        initialValues={{
          planName: selectedPlan?.planName || "",
          description: selectedPlan?.description || "",
          routines: selectedPlan?.routines || "",
          goal: selectedPlan?.goal || "",
        }}
      >
        <Form.Item
          name="planName"
          label="Plan Name"
          rules={[{ required: true, message: "Please enter a plan name" }]}
        >
          <Input 
            placeholder="Enter plan name" 
            style={{ borderRadius: 8 }}
          />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
        >
          <TextArea 
            placeholder="Describe your learning plan" 
            autoSize={{ minRows: 3, maxRows: 6 }}
            style={{ borderRadius: 8 }}
          />
        </Form.Item>

        <Form.Item
          name="routines"
          label="Skills to Learn (comma separated)"
        >
          <Input 
            placeholder="e.g. React, JavaScript, UI Design" 
            style={{ borderRadius: 8 }}
          />
        </Form.Item>

        <Form.Item
          name="goal"
          label="Tutorials & Resources"
        >
          <TextArea 
            placeholder="List tutorials or resources for this plan" 
            autoSize={{ minRows: 2, maxRows: 4 }}
            style={{ borderRadius: 8 }}
          />
        </Form.Item>

        <Form.Item style={{ marginTop: 16 }}>
          <Space style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button 
              onClick={() => {
                state.editLearningProgressOpened = false;
                form.resetFields();
              }}
              style={{ 
                borderRadius: 8, 
                borderColor: themeColors.primary,
              }}
            >
              Cancel
            </Button>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={updateLoading}
              style={{
                background: themeColors.primary,
                borderColor: themeColors.primary,
                borderRadius: 8,
                boxShadow: "0 2px 8px rgba(255, 107, 53, 0.2)"
              }}
            >
              Update Plan
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditLearningProgressModal;