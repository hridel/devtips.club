'use client';

import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { zodResolver } from '@hookform/resolvers/zod';
import { Tag } from '@prisma/client';

import RichText from '#/components/rich-text';
import { Badge } from '#/components/ui/badge';
import { Button } from '#/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '#/components/ui/form';
import { Input } from '#/components/ui/input';
import { Label } from '#/components/ui/label';
import { createTip, updateTip } from '#/lib/actions/tips';
import { devTipFormSchema } from '#/lib/definitions';
import { toast } from '#/lib/hooks/use-toast';

export type DevTipFormProps =
    | {
          mode: 'create';
      }
    | {
          mode: 'edit';
          originalData: {
              id: string;
              title: string;
              lexicalState: string;
              tags: Tag[];
          };
      };

const DevTipForm = (props: DevTipFormProps) => {
    const { mode } = props;
    const router = useRouter();
    const [mutating, setMutating] = useState<boolean>(false);
    const [tags, setTags] = useState<
        Array<
            Omit<Tag, 'id' | 'slug' | 'createdAt' | 'updatedAt'> & {
                id?: number;
                slug?: string;
            }
        >
    >(mode === 'edit' ? props.originalData.tags : []);
    const [newTagInput, setNewTagInput] = useState<string>('');

    const form = useForm<z.infer<typeof devTipFormSchema>>({
        resolver: zodResolver(devTipFormSchema),
        defaultValues: {
            title: mode === 'edit' ? props.originalData.title : '',
            lexicalState:
                mode === 'edit' ? props.originalData.lexicalState : undefined,
        },
    });

    const { setValue } = form;

    const onSubmit = (values: z.infer<typeof devTipFormSchema>) => {
        setMutating(true);
        if (mode === 'create') {
            createTip({
                ...values,
                tags: tags.map((t) => t.title),
                lexicalState: values.lexicalState || '',
            })
                .then((response) => {
                    router.push(`/tips/${response.id}`);
                })
                .catch((error) => {
                    toast({
                        title: 'Error',
                        description: `Failed to create a new tip: ${error.message}`,
                        variant: 'destructive',
                    });
                })
                .finally(() => {
                    setMutating(false);
                });
        } else if (mode === 'edit') {
            updateTip(props.originalData.id, {
                ...values,
                lexicalState: values.lexicalState || '',
                tags: tags.map((t) => t.title),
            })
                .then((response) => {
                    router.push(`/tips/${response.id}`);
                })
                .catch((error) => {
                    toast({
                        title: 'Error',
                        description: `Failed to update a dev tip: ${error.message}`,
                        variant: 'destructive',
                    });
                })
                .finally(() => {
                    setMutating(false);
                });
        }
    };

    const handleRemoveNewTag = (tag: string) => {
        setTags(tags.filter((t) => t.title !== tag));
    };

    const handleNewTagInputChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setNewTagInput(e.target.value);
    };

    const handleAddNewTag = () => {
        if (!newTagInput.trim().length) {
            toast({
                title: 'Error',
                description: 'Tag name cannot be empty',
                variant: 'destructive',
            });
            return;
        }
        if (tags.some((tag) => tag.title === newTagInput.trim())) {
            toast({
                title: 'Error',
                description: `Tag "${newTagInput.trim()}" is already added`,
                variant: 'destructive',
            });
            return;
        }
        setTags([...tags, { title: newTagInput.trim() }]);
        setNewTagInput('');
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (newTagInput.trim().length) handleAddNewTag();
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {tags?.map((tag) => (
                    <input
                        key={tag.title}
                        type="hidden"
                        name="tag[]"
                        value={tag.title}
                    />
                ))}
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Your tip title"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="lexicalState"
                    render={() => (
                        <FormItem>
                            <FormControl>
                                <RichText
                                    label="Dev Tip content"
                                    required
                                    initValue={form.getValues('lexicalState')}
                                    contentChangeCallback={(content) => {
                                        setValue(
                                            'lexicalState',
                                            content.jsonString
                                        );
                                        setValue(
                                            'htmlContent',
                                            content.htmlString
                                        );
                                    }}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />

                <div>
                    <div>
                        <Label>Tags:</Label>
                        {Boolean(tags.length) && (
                            <div>
                                {tags.map((tag) => (
                                    <Badge key={tag.title} variant="outline">
                                        <span>{tag.title}</span>
                                        <X
                                            onClick={() =>
                                                handleRemoveNewTag(tag.title)
                                            }
                                            className="w-3 h-3 ml-2 cursor-pointer hover:text-red-500"
                                        />
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </div>

                    <div>
                        <Input
                            type="text"
                            placeholder="new tag"
                            value={newTagInput}
                            onChange={handleNewTagInputChange}
                            onKeyDown={handleKeyDown}
                        />
                        <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={handleAddNewTag}
                        >
                            + Add tag
                        </Button>
                    </div>
                </div>

                <Button type="submit" disabled={mutating}>
                    {mutating ? 'Saving...' : 'Save'}
                </Button>
            </form>
        </Form>
    );
};

export default DevTipForm;
