import * as React from "react";
import { FormInputProps } from "./FormInputProps.type";

import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Constants } from "@/lib/constants";
import { cn, isFunction } from "@/lib/utils";
import { DatePicker } from "./date-picker/DatePicker";

// import { AvatarInput } from "./avatar/AvatarInput";
import { FileDropzone } from "./file-upload/FileDropzone";
// import { FileDropzonePresigned } from "./file-dropzone/FileDropzonePresigned";

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      control,
      type,
      label,
      fieldName,
      placeholder,
      className,
      classNameInput,
      classNameLabel,
      classNameIcon,
      icon,
      alignIcon,
      onClickIcon,
      onChange,
      onKeyUp,
      description,
      maxLength,
      options,
      value,
      // validate = [],
      autoFocus = false,
      disabled = false,
      readOnly = false,
      onChangeSelect,
      classNameContent,
      labelCheckbox,
      required = false,
    },
    ref
  ) => {
    const handleClickIcon = (e: React.MouseEvent) => {
      if (onClickIcon && isFunction(onClickIcon)) {
        onClickIcon(e);
      }
    };
    return (
      <FormField
        control={control}
        name={fieldName}
        // rules={{ validate: Validator.genValidate(validate, fieldName) }}
        render={({ field }: any) => {
          const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            field.onChange(event.target.value);
            if (onChange && isFunction(onChange)) {
              onChange(event.target.value);
            }
          };
          const handleChangeSelect = (value: any) => {
            if (onChangeSelect && isFunction(onChangeSelect)) {
              onChangeSelect(value);
            }
          };
          const handleKeyUp = (event: React.KeyboardEvent) => {
            if (onKeyUp && isFunction(onKeyUp)) {
              onKeyUp(event);
            }
          };

          const handleCheckboxChange = (value: boolean | string) => {
            field.onChange(value);
            if (onChange && isFunction(onChange)) {
              onChange(value);
            }
          };
          return (
            <FormItem className={className}>
              {label ? (
                <FormLabel className={classNameLabel}>
                  {label}
                  {required ? (
                    <span className="w-fit text-red-600">{" *"}</span>
                  ) : null}
                </FormLabel>
              ) : null}
              <FormControl>
                {renderInput({
                  type,
                  placeholder,
                  classNameInput,
                  icon,
                  alignIcon,
                  onClickIcon: handleClickIcon,
                  onChange: handleChange,
                  onChangeSelect: handleChangeSelect,
                  onKeyUp: handleKeyUp,
                  onCheckboxChange: handleCheckboxChange,
                  maxLength,
                  ref,
                  field,
                  value,
                  options,
                  disabled,
                  classNameIcon,
                  autoFocus,
                  classNameContent,
                  labelCheckbox,
                  readOnly,
                })}
              </FormControl>
              {description ? (
                <FormDescription>{description}</FormDescription>
              ) : null}
              <FormMessage />
            </FormItem>
          );
        }}
      />
    );
  }
);

FormInput.displayName = "FormInput";

const renderInput = ({
  value,
  type,
  placeholder,
  classNameInput,
  icon,
  alignIcon,
  onClickIcon,
  onChange,
  onKeyUp,
  field,
  maxLength,
  options,
  disabled,
  readOnly,
  classNameIcon,
  autoFocus,
  onChangeSelect,
  classNameContent,
  labelCheckbox,
  onCheckboxChange,
  ref,
}: any) => {
  switch (type) {
    case Constants.INPUT_TYPE.TEXT:
    case Constants.INPUT_TYPE.EMAIL:
    case Constants.INPUT_TYPE.PASSWORD:
      return (
        <Input
          {...field}
          type={type}
          placeholder={placeholder}
          className={classNameInput}
          icon={icon}
          alignIcon={alignIcon}
          onClickIcon={onClickIcon}
          onChange={onChange}
          onKeyUp={onKeyUp}
          maxLength={maxLength}
          disabled={disabled}
          readOnly={readOnly}
          classNameIcon={classNameIcon}
          autoFocus={autoFocus}
          ref={ref}
        />
      );
    case Constants.INPUT_TYPE.CHECKBOX:
      return (
        <Checkbox
          {...field}
          checked={field.value}
          onCheckedChange={onCheckboxChange}
          className={classNameInput}
          disabled={disabled}
          label={labelCheckbox}
        />
      );

    case Constants.INPUT_TYPE.SELECT:
      return (
        <Select
          defaultValue={String(field.value)} // Chuyển giá trị ban đầu thành chuỗi
          onValueChange={(value: string) => {
            const parsedValue =
              options?.find((option: any) => String(option.key) === value)
                ?.key ?? value; // Lấy giá trị gốc
            field.onChange(parsedValue); // Cập nhật giá trị về dạng gốc vào React Hook Form
            if (onChangeSelect && isFunction(onChangeSelect)) {
              onChangeSelect(parsedValue); // Gọi callback với giá trị gốc
            }
          }}
          disabled={disabled}
        >
          <SelectTrigger className={`w-full ${classNameInput}`}>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent className={classNameContent}>
            {options?.map(
              (option: { key: any; label: string }, index: number) => (
                <SelectItem key={index} value={String(option.key)}>
                  {option.label}
                </SelectItem>
              )
            )}
          </SelectContent>
        </Select>
      );

    case Constants.INPUT_TYPE.TEXTAREA:
      return (
        <Textarea
          {...field}
          type={type}
          placeholder={placeholder}
          className={classNameInput}
          onChange={onChange}
          onKeyUp={onKeyUp}
          maxLength={maxLength}
          ref={ref}
        />
      );
    case Constants.INPUT_TYPE.FILE_UPLOAD:
      return (
        <FileDropzone
          {...field}
          type={type}
          placeholder={placeholder}
          className={classNameInput}
          onChange={onChange}
          onKeyUp={onKeyUp}
          maxLength={maxLength}
          disabled={disabled}
          readOnly={readOnly}
          onClickIcon={onClickIcon}
        />
      );
    // case Constants.INPUT_TYPE.FILE_UPLOAD_PRESIGNED:
    //   return (
    //     <FileDropzonePresigned
    //       {...field}
    //       type={type}
    //       placeholder={placeholder}
    //       className={classNameInput}
    //       onChange={onChange}
    //       onKeyUp={onKeyUp}
    //       maxLength={maxLength}
    //       disabled={disabled}
    //       readOnly={readOnly}
    //       onClickIcon={onClickIcon}
    //     />
    //   );
    // case Constants.INPUT_TYPE.AVATAR:
    //   return (
    //     <AvatarInput
    //       {...field}
    //       type={type}
    //       placeholder={placeholder}
    //       className={classNameInput}
    //       onChange={onChange}
    //       onKeyUp={onKeyUp}
    //       maxLength={maxLength}
    //       disabled={disabled}
    //       readOnly={readOnly}
    //       onClickIcon={onClickIcon}
    //     />
    //   );
    case Constants.INPUT_TYPE.RADIO:
      return (
        <RadioGroup
          {...field}
          value={field.value?.toString()}
          onValueChange={(e) => {
            field.onChange(e);
            onChangeSelect(e);
          }}
          disabled={disabled}
          className={cn("grid grid-cols-2 gap-4", classNameInput)}
        >
          {options?.map((x: any, index: number) => {
            const id = React.useId();
            const formItemId = `${id}-form-item`;

            return (
              <div
                key={index}
                className={cn(
                  `flex w-full items-center gap-2 rounded-sm border bg-background p-4 hover:border-gray-300 ${
                    field.value?.toString() === x.key ? "border-blue-500" : ""
                  } `,
                  classNameContent
                )}
              >
                <RadioGroupItem value={x.key?.toString()} id={formItemId} />
                <FormLabel
                  className={cn(
                    "block w-full cursor-pointer",
                    classNameContent
                  )}
                  htmlFor={formItemId}
                >
                  {x.label}
                </FormLabel>
              </div>
            );
          })}
        </RadioGroup>
      );
    case Constants.INPUT_TYPE.DATE_PICKER:
      return (
        <DatePicker
          field={{ ...field }}
          // type={type}
          // placeholder={placeholder}
          // className={classNameInput}
          // onChange={onChange}
          // onKeyUp={onKeyUp}
          // maxLength={maxLength}
          // disabled={disabled}
          // readOnly={readOnly}
          // onClickIcon={onClickIcon}
        />
      );
    default:
      return (
        <Input
          {...field}
          type={type}
          placeholder={placeholder}
          className={classNameInput}
          icon={icon}
          alignIcon={alignIcon}
          onClickIcon={onClickIcon}
          onChange={onChange}
          onKeyUp={onKeyUp}
          maxLength={maxLength}
          disabled={disabled}
          readOnly={readOnly}
          classNameIcon={classNameIcon}
          autoFocus={autoFocus}
          ref={ref}
          value={value}
        />
      );
  }
};
