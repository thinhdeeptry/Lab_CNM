const { dynamodb } = require("../utils/aws-helper")
const { v4: uuidv4 } = require("uuid")

const tableName = "SamPham";

const subjectModel = {
    createSubject: async subjectData => {
        const subjectId = uuidv4();
        const params = {
            TableName: tableName,
            Item: {
                id: subjectId,
                course_type: subjectData.loai,
                department: subjectData.khoa,
                image: subjectData.image,
                nameSP: subjectData.ten,
                semester: subjectData.hoc_ki,
            }
        };
        try {
            await dynamoDB.put(params).promise();
            return { id: subjectId, ...subjectData }
        } catch (error) {
            console.error("error creating subject: ", error);
            throw error;
        }
    },

    getSubjects: async() => {
        const params = {
            TableName: tableName,
        };
        try {
            const subjects = await dynamoDB.scan(params).promise();
            return subjects.Items;
        } catch (error) {
            console.error("Error getting subjects: ", error);
            throw error;
        }
    },

    updateSubject: async(subjectId, subjectData) => {
        const params = {
            TableName: tableName,
            Key: {
                id: subjectId,
                //neu set sortkey thi them truong do vao. ex: name: subjectData.name,
            },
            UpdateExpression: "set #t = :course_type, #d = :department, #i = :image, #n = :name, #s = :semester",
            ExpressionAttributeNames: {
                "#t": course_type,
                "#d": department,
                "#i": image,
                "#n": name,
                "#s": semester,
            },
            ExpressionAttributeValues: {
                ":course_type": subjectData.course_type,
                ":department": subjectData.department,
                ":image": subjectData.image,
                ":name": subjectData.name,
                ":semester": subjectData.semester,
            },
            ReturnValues: "ALL_NEW", // Trả về thông tin của subject sau khi cập nhật,  có các option khác như NONE, UPDATED_OLD, ALL_OLD
        };
        try {
            const updatedSubject = await dynamoDB.update(params).promise();
            return updatedSubject.Attributes;
        } catch (error) {
            console.error("Error updating subject: ", error);
            throw error;
        }
    },
    deleteSubject: async(subjectId) => { // them name neu set sortkey
        const params = {
            TableName: tableName,
            Key: {
                id: subjectId,
                //neu set sortkey thi them truong do vao. ex: name: subjectData.name,
            },
        };
        try {
            await dynamodb.delete(params).promise();
            return { id: subjectId };
        } catch (error) {
            console.error("Error deleting subject: ", error);
            throw error;
        }
    }
}
module.exports = subjectModel;