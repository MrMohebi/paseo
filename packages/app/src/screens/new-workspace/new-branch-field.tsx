import { View } from "react-native";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native-unistyles";
import { Field, FormTextInput } from "@/components/ui/form-field";
import { useIsCompactFormFactor } from "@/constants/layout";
import type { PickerItem } from "../new-workspace-picker-item";

export function NewBranchField({
  showRefPicker,
  worktreeSupport,
  baseItem,
  pending,
  value,
  onChange,
}: {
  showRefPicker: boolean;
  worktreeSupport: "supported" | "unsupported" | "unknown";
  baseItem: PickerItem | null;
  pending: boolean;
  value: string;
  onChange: (value: string) => void;
}) {
  const { t } = useTranslation();
  const isCompact = useIsCompactFormFactor();
  if (!showRefPicker || worktreeSupport === "unsupported" || baseItem?.kind === "github-pr")
    return null;
  return (
    <View style={styles.container}>
      <Field label={t("newWorkspace.fields.newBranchName")}>
        <FormTextInput
          testID="new-workspace-branch-name"
          accessibilityLabel={t("newWorkspace.fields.newBranchName")}
          size={isCompact ? "md" : "sm"}
          initialValue={value}
          onChangeText={onChange}
          placeholder={t("newWorkspace.fields.automaticBranchName")}
          autoCapitalize="none"
          autoCorrect={false}
          editable={!pending}
        />
      </Field>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    paddingHorizontal: theme.spacing[6],
    marginBottom: theme.spacing[4],
  },
}));
